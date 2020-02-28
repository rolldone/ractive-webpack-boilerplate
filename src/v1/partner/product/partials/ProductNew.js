import BaseRactive from 'BaseRactive';
import InputText from '@v1/components/input/Input';
import InputCheckbox from '@v1/components/input/InputCheckbox.js';
import InputDropdown from '@v1/components/input/InputDropdown';
import InputImport from '@v1/components/input/InputImport';
import template from './views/ProductNewView.html';
import IngredientList from '@v1/partner/ingredient/helper/IngredientList';
import IngredientFormDialog from '@v1/partner/ingredient/helper/IngredientFormDialog';
export default BaseRactive.extend({
	template,
	components : {
		"input-text" : InputText,
		"input-checkbox" : InputCheckbox,
		"input-dropdown" : InputDropdown,
		"input-import" : InputImport,
		'ingredient-list' : IngredientList,
		'ingredient-dialog' : IngredientFormDialog
	},
	data : function(){
		return {
			tabs : [{
				key : 'FORM',
				label : gettext("Créer une nouvelle cuisine")
			}],
			form_rules : {
				nom : 'required',
				category : 'required',
				ingredient_datas : 'required'
			},
			form_type_select : '',
			categories : {},
			bus_param : [],
			form_data : {
				prix_solo : 0.00,
				prix_consigne_solo : 0.00,
				prix_duo : 0.00,
				prix_consigne_duo : 0.00,
				prix_famille : 0.00,
				prix_consigne_famille : 0.00,
			},
			type_forms : [],
			conseils_de_preparation_datas : [], 
			submit : gettext("ENREGISTRER"),
			ingredient_datas : []
		}
	},
	isolate : true,
	onconfig : function(){
		let self = this;
		self._super();
		return new Promise(async function(resolve){
			self.root.findComponent('head-menu').setHeader('page_name',gettext("Créer un plat"));
			let resBUsCat = await self.getBusParam();
			self.setBusCats(resBUsCat);
			let resTypeForm = await self.getFormBusinessByCategory('PLATS_CATEGORY');
			self.setFormBusinessByCategory(resTypeForm);
			await self.getBusinessParameterByCat('CONSEILS_DE_PREPARATION','conseils_de_preparation_datas');
			await self.getBusinessParameterByCat('TYPE_BOISSONS','type_datas');
			await self.getBusinessParameterByCat('CONDITIONNEMENT','conditionnement_datas');
			await self.getBusinessParameterByCat('CONTENANCE','contenance_datas');
			resolve();
		})
	},
	oncomplete :  function(){
		let self = this;
		this._super();
		return new Promise(async function(resolve){
			self.initSelectionDOM('.ui.checkbox');
			self.initSelectionDOM('.ui.dropdown');
			self.initTextvalidation();
			let closeFormTypeSelect = self.observe('form_type_select',function(newValue,oldValue){
				setTimeout(function(){
					console.log('closeFormTypeSelect reactive');
					self.initSelectionDOM('.ui.dropdown');
					self.initSelectionDOM('.ui.checkbox');
				},2000)
			})
			self.inputImport = self.findComponent('input-import');
			self.inputImport.setOnChangeListener(function(action,props){
				self.setUpdate('form_data',{
					photo : props
				})
			});
			resolve();
		})
	},
	returnPlatsHttpRequest : function(){
		return new PlatsHttpRequest();
	},
	getBusParam : async function(){
		try{
			let self = this;
			let url = window.HTTP_REQUEST.BUS_PARAM_XHR.BUS_PARAMS;
			let resData = await self.getData(url,{});
			return resData;
		}catch(ex){
			console.log('getBusParam -> ',ex);
		}
	},
	setBusCats : function(props){
		let self = this;
		switch(props.status){
			case 'error':
			break;
		}
		self.set('bus_param',props.return);
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
				self.ui_dropdown_select_category = $('.ui.dropdown.select-category');
				self.ui_dropdown_select_type = $('.ui.dropdown.select-type');
				self.ui_dropdown_select_conseils_de_preparation = $('.ui.dropdown.select-conseils_de_preparation');
				self.ui_dropdown_select_contenance = $('.ui.dropdown.select-contenance');
				self.ui_dropdown_select_conditionnement = $('.ui.dropdown.select-conditionnement');
				var ui_dropdown_config = {
					onChange : function(value, text, $choice){
						console.log('value',value);
						console.log('text',text);
						console.log('key',$($choice).attr('data-key'));
						let hidden = $($choice).parent();
						hidden = hidden.siblings('input[type=hidden]');
						let name = hidden.attr('name');
						let dataKey = $($choice).attr('data-key');
						let newData = {};
						newData[name] = value;
						self.setUpdate('form_data',newData);
					}
				}
				self.ui_dropdown_select_category.dropdown({
					onChange : async function(value, text, $choice){
						let hidden = $($choice).parent();
						hidden = hidden.siblings('input[type=hidden]');
						let name = hidden.attr('name');
						let dataKey = $($choice).attr('data-key');
						let newData = {};
						newData[name] = value;
						self.setUpdate('form_data',newData);
						self.set('form_type_select',dataKey);
						await self.waitingTimeout(2000)
						self.ingredient_form_dialog = self.findComponent('ingredient-dialog');
						self.ingredient_form_dialog.setOnFormDialogListener(async function(action,props,e){
							switch(action){
								case 'CALLBACK':
									let ingredient_datas = self.get('ingredient_datas');
									for(var a=0;a<ingredient_datas.length;a++){
										if(props.ingredient_id == ingredient_datas[a].ingredient_id){
											ingredient_datas.splice(a,1);
											break;
										}
									}
									ingredient_datas.push(Object.assign({},props));
									self.ingredientFormList.setDatas(ingredient_datas);
									await self.setUpdate('form_data',{
										ingredient_datas : ingredient_datas
									})
									self.ingredient_form_dialog.dispose();
									self.initSubmitValidation(self.get('form_rules'),function(){});
								break;
							}
						})
						self.ingredientFormList = self.findComponent('ingredient-list');
						self.ingredientFormList.setOnFormListListener(function(action,props,e){
							switch(action){
								case 'UPDATE':
									self.ingredient_form_dialog.open(props);
									break;
								case 'DELETE':
									self.set('ingredient_datas',props);
									break;
							}
						})
						self.initTextvalidation();
					}
				});
				self.ui_dropdown_select_type.dropdown(ui_dropdown_config);
				self.ui_dropdown_select_conseils_de_preparation.dropdown(ui_dropdown_config);
				self.ui_dropdown_select_contenance.dropdown(ui_dropdown_config);
				self.ui_dropdown_select_conditionnement.dropdown(ui_dropdown_config);
			break;
		}
	},
	initializeEditor : function(){
		let self = this;
		self.textEditor = $('#editor').summernote({
			callbacks: {
					onChange: function() {
						if(self.pendingChange != null){
							self.pendingChange.cancel();
						}
						self.pendingChange = _.debounce(function(code){
							self.setUpdate('form_data',{
								content : code
							}).then(function(){
								self.initSubmitValidation({
									content : 'required'
								},function(){})
							})
						},300);
						self.pendingChange(self.textEditor.summernote('code'));
					}
				}  // callback as option 
		});
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
			case 'SELECT_INGREDIENT':
				self.ingredient_form_dialog.open();
			break;
			case 'SUBMIT':
			await self.submitData();
			return;
			case 'BACK':
			return window.history.back();
		}
	},
	submitData : async function(){
		let self = this;
		await self.setUpdate('form_data',{
			ingredient_datas : self.get('ingredient_datas').length > 0 ? JSON.stringify(self.get('ingredient_datas')):null
		})
		let formData = self.objectToFormData(self.get('form_data'));
		let url = window.HTTP_REQUEST.PRODUCT_XHR.ADD;
		let current_form_rules = self.get('form_rules');
		self.initSubmitValidation(current_form_rules,async function(){
			try{
				console.log('vmdfkvmkfv',self.get('form_data'));
				return;
				let httpRequest = self.returnPlatsHttpRequest();
				let resData = await httpRequest.addSelfPlat(self.get('form_data'));
				swalSuccess(gettext("Création réussie"));
				self.set('form_data',{});
				$(self.find('#form-create'))[0].reset();
				self.inputImport.resetPreview();
				self.ui_dropdown_select_category.dropdown('clear');
				self.ui_dropdown_select_type.dropdown('clear');
				self.ui_dropdown_select_conseils_de_preparation.dropdown('clear');
				self.ui_dropdown_select_contenance.dropdown('clear');
				self.ui_dropdown_select_conditionnement.dropdown('clear');
			}catch(ex){
				console.error('submitData - ex ',ex);
			}
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
	initSubmitValidation : function(form_rule,callback){
		let self = this;
		let currentFormData = self.get('form_data');
		self.submitValidation({
			form_data : self.get('form_data'),
			form_rules : form_rule
		},function(res){
			let parent = $(self.find('form'));
			window.eachObject(res.error,function(i,key,val){
				switch(key){
					case 'ingredient_datas':
						console.log('val',val);
						var gg = parent.find('#ingredient_list').children('span.error').text(val);
						break;
					default:
					$.when(parent.find('input[name='+key+']')).done(function(rr){
						rr = rr.parents('.field').first();
						rr.find('span.error').text(val);
					});
					break;
				}
			})
			window.eachObject(res.form_data,function(i,key,val){
				switch(key){
					case 'ingredient_datas':
						parent.find('#ingredient_list').children('span.error').text('');
						break;
					default:
					$.when(parent.find('input[name='+key+']')).then(function(rr){
							rr = rr.parents('.field').first();
							rr.find('span.error').text('');
					})
					break;
				}
			})
			if(res.status == 'complete'){   
				callback(res.form_data);
			}
		})
	},
	getFormBusinessByCategory : async function(whatTypeCategory){
		try{
			let self = this;
			let url = window.HTTP_REQUEST.BUS_PARAM_XHR.BUS_PARAMS+'?category_name='+whatTypeCategory;
			let resData = await self.getData(url,{});
			return resData;
		}catch(ex){
			console.log('getBusParam -> ',ex);
		}
	},
	setFormBusinessByCategory : function(props){
		let self = this;
		switch(props.status){
			case 'error':
			break;
		}
		let drop = [];
		self.set('type_forms',props.return);
	},
	getBusinessParameterByCat : async function(whatCatName,savedData){
		try{
			let self = this;
			let url = window.HTTP_REQUEST.BUS_PARAM_XHR.BUS_PARAMS+'?category_name='+whatCatName;
			let resData = await self.getData(url,{});
			self.set(savedData,resData.return)
		}catch(ex){
			console.log('getBusParam -> ',ex);
		}
	},
	getMomentDate : function(dateTimeString){
		if(dateTimeString != ""){
			return moment(dateTimeString,'YYYY-MM-DD HH:mm:ss').format('LLL');
		}
	},
	on : {
		setting_key : function(event){
			alert(setting_key);
		}
	}
})