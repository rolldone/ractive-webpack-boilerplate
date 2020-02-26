import Layout from "../Layout";
import BaseRactive from "../../../lib/ractive/BaseRactive";
import template from './views/UserNewView.html';
import InputText from '@v1/components/input/Input.js';
import InputDropdown from '@v1/components/input/InputDropdown.js';
import InputImport from '@v1/components/input/InputImport.js';
import PrivilegeHttpRequest from '@v1/partner/services/PrivilegeHttpRequest.js';

export const UserNew = BaseRactive.extend({
	template,
	isolated : true,
	components : {
		"input-text" : InputText,
		"input-dropdown" : InputDropdown,
		"input-import" : InputImport
	},
	data : function(){
		return { 
			title_form : gettext("Créer un nouvel utilisateur"),
			form_data : {},
			form_rules : {
				photo : 'required',
				nom : 'required',
				prenom : 'required',
				email : 'required',
				group_id : 'required',
				status : 'required',
				password : 'required|min:8',
				password_confirm : 'required|min:8|same:password'
			},
			is_email_disabled: false,
			privilege_datas : [],	
			status_datas : [{
				label : gettext('Actif'),
				id : 1
			},{
				label : gettext('DÉSACTIVER'),
				id : 2
			},{
				label : gettext('EN ATTENTE'),
				id : 0
			}],
			submit : gettext("ENREGISTRER"),
		}
	},
	onconfig :  function(){
		let self = this;
		self._super();
		return new Promise(async function(resolve){
			self.setPrivileges(await self.getPrivileges());
			self.root.findComponent('head-menu').setHeader('page_name',gettext("Créer un utilisateur"));  
			resolve();
		})
	},
	oncomplete : function(){
		let self = this;
		self._super();
		self.initSelectionDOM('.ui.dropdown');
		self.initTextvalidation();
		self.initTextPasswordValidation();
		self.inputImport = self.findComponent('input-import');
		self.inputImport.setOnChangeListener(function(action,props){
			self.setUpdate('form_data',{
				photo : props
			})
		})
	},
	getPrivileges : async function(){
		let self = this;
		try{
			var privilege = new PrivilegeHttpRequest();
			return await privilege.getBelowGroupId();
		}catch(ex){
			console.error('getPrivileges - ex ',ex);
		}
	},
	setPrivileges : async function(props){
		let self = this;
		switch(props.status){
			case 'error':
			return console.error('setPrivileges - error ',props);
		}
		console.log('privilege_datas',props.return);
		await self.set('privilege_datas',props.return);
	},
	initSelectionDOM : function(action){
		let self = this;
		switch(action){
			case '.ui.checkbox':
				var configCheck = {
					onChange : function(){
						let isChecked = $(this).is(':checked')==true?1:0;
						let theValue = {};
						theValue[$(this).attr('name')] = isChecked;
						self.setUpdate('form_data',theValue);
					}
				}
				self.dom_congelation = $('.ui.checkbox.congelation');
				self.dom_consignes = $('.ui.checkbox.consignes')
				self.dom_congelation.checkbox(configCheck);
				self.dom_consignes.checkbox(configCheck);
			break;
			case '.ui.dropdown':
				var ui_dropdown_config = {
					onChange : function(value, text, $choice){
						let hidden = $($choice).parent();
						hidden = hidden.siblings('input[type=hidden]');
						let name = hidden.attr('name');
						self.setUpdate('form_data',{
							[name] : value
						});
					}
				}
				self.ui_dropdown_group_id = $('#group_id').dropdown(ui_dropdown_config);
				self.ui_dropdown_status = $('#status').dropdown(ui_dropdown_config);
				console.log('self.ui_dropdown_config',self.ui_dropdown_status);
				
			break;
		}
	},
	 handleClick : async function(action,props,e){
		let self = this;
		e.preventDefault();
		switch(action){
			case 'BROWSE_ICON':
				$('input[name=icon_file]').trigger('click');
				$('input[name=icon_file]').on('change',function(e){
					self.set('text_icon_file',$(this).val());
					self.setUpdate('form_data',{
						icon_file : $(this)[0].files[0]
					});
				})
			break;
			case 'SUBMIT':
			return self.submitData();
			case 'BACK':
			return window.history.back();
		}
	},
	submitData : function(){
		let self = this;
		let formData = self.objectToFormData(self.get('form_data'));
		console.log("formData ==> ", self.get('form_data'));
		let url = window.HTTP_REQUEST.USER_XHR.ADD;
		let current_form_rules = self.get('form_rules');
		self.initSubmitValidation(current_form_rules,function(){
			self.postData(url,formData).then(function(res){
				console.log('res after submit ->',res);
				switch(res.status){
					case 'success':
						swalSuccess(gettext("Création réussie"));
						self.set('form_data',{});
						$(self.find('#form-create'))[0].reset();
						self.ui_dropdown_status.dropdown('clear');
						return;
					break;
				}
			})
		})
	},
	initTextvalidation : function(){
		let self = this;
		self.inputTextValidation(self.find('#form-create'),{
			form_data : self.get('form_data'),
			form_rules : self.get('form_rules'),
			element_target : 'input[type=text],input[type=email],input[type=number],textarea'
		},function(res,e){
			self.setUpdate('form_data',res.form_data).then(function(){
				let parent = $(e.target).parents('.field').first();
				switch(res.status){
					case 'error':
					return parent.find('span.error').text(res.message);
					case 'valid':
					case 'complete':
					return parent.find('span.error').text('');
				}
			})
		})
	},
	initTextPasswordValidation : function(){
		let self = this;
		self.inputTextValidation(self.find('#form-create'),{
			form_data : self.get('form_data'),
			form_rules : self.get('form_rules'),
			element_target : 'input[type=password]'
		},function(res,e){
			console.log('res',res);
			self.setUpdate('form_data',res.form_data).then(function(){
				let parent = $(e.target).parents('.field').first();
				switch(res.status){
					case 'error':
					return parent.find('span.error').text(res.message);
					case 'valid':
					case 'complete':
					return parent.find('span.error').text('');
				}
			})
		})
	},
	initSubmitValidation : function(form_rule,callback){
		// console.log('form_rule',form_rule);
		let self = this;
		// console.log('self',self.get('form_data'))
		let currentFormData = self.get('form_data');
		self.submitValidation({
			form_data : self.get('form_data'),
			form_rules : form_rule
		},function(res){
			console.log('res',res);
			let parent = $(self.find('#form-create'));
			for(var key in res.form_data){
				switch(key){
					default:
					setTimeout(function(key){
						$.when(parent.find('input[name='+key+']')).then(function(rr){
								rr = rr.parents('.field').first();
								rr.find('span.error').text('');
						})
					}.bind(self,key),100)
					break;
				}
			}
			for(var key in res.error){
				switch(key){
					default:
					setTimeout(function(key){
						$.when(parent.find('input[name='+key+']')).done(function(rr){
							rr = rr.parents('.field').first();
							rr.find('span.error').text(res.error[key]);
						});
					}.bind(self,key),100);
					break;
				}
			}
			if(res.status == 'complete'){   
				callback(res.form_data);
			}
		})
	},
})

export default Layout({
	BodyContent : UserNew
})