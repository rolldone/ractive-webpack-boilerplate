import BaseRactive from "../../lib/ractive/BaseRactive";
import template from './views/register.html';
export default BaseRactive.extend({
	template,
	isolate : true,
	data : function(){
		return {
			form_data : {},
			form_error : {},
			form_rules : {
				user_first_name : 'required',
				user_email : 'required|email',
				user_password : 'required|min:3',
				user_password_confirm : 'required|same:user_password'
			}
		}
	},
	onconfig : function(){},
	onrender : function(){},
	oncomplete : function(){
		let self = this;
		self.inputTextValidation('#form-register',{
			form_rules : self.get('form_rules'),
			form_data : self.get('form_data'),
			element_target : 'input'
		},function(res,e){
			self.set('form_data',res.form_data);
			let parent = $(e.target).parents('.field');
			switch(res.status){
				case 'error':
				return parent.find('.base_wr.row').find('span').text(res.message);
				case 'valid':
				case 'complete':
				return parent.find('.base_wr.row').find('span').text('');
			}
		})
	},
	register : function(){
		let self = this;
		return new Promise(function(resolve){
			let formData = new FormData($('#form-register')[0]);
			self.postData($('#form-register').attr('action'),formData).then(function(res){
				resolve(res);
			})
		})
	},
	handleClick : function(action,props,e){
		switch(action){
			case 'SUBMIT':
				e.preventDefault();
				this.register().then(function(res){
					if(res.status == 'error'){
						return;
					}
					window.location.href = res.return.redirect;
				})
			return false;
		}
	}
})