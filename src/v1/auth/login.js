import BaseRactive from "../../lib/ractive/BaseRactive";
import template from './views/login.html';
import AuthHttpRequest from "./services/AuthHttpRequest";

export default BaseRactive.extend({
	template,
	isolate : true,
	data : function(){
		return {
			form_rules : {
				user_email : 'required|email',
				user_password : 'required'
			},
			form_data : {},
			notification : ''
		}
	},
	onconfig : function(){},
	onrender : function(){},
	oncomplete : function(){
		let self = this;
		self.inputTextValidation('#auth',{
			form_rules : self.get('form_rules'),
			form_data : self.get('form_data'),
			element_target : 'input'
		},function(res,e){
			self.set('form_data',res.form_data);
			self.set('notification','');
			let parent = $(e.target).parents('.field');
			switch(res.status){
				case 'error':
				parent.find('.base_wr.row').find('span').text(res.message);
				break;
				case 'valid':
				case 'complete':
				parent.find('.base_wr.row').find('span').text('');
				break;
			}
		})
	},
	returnNewAuthHttpRequest : function(){
		return new AuthHttpRequest();
	},
	handleClick : function(action,props,e){
		switch(action){
			case 'SUBMIT':
				e.preventDefault();
				this.login()
			return false;
		}
	},
	login : async function(){
		try{
			let httpRequest = this.returnNewAuthHttpRequest();
			console.log('thisvdf',this.get('form_data'));
			let resData = await httpRequest.login(this.get('form_data'));
			window.localStorage.setItem('token',resData.return.token);
			window.location.href = '/member/user/users';
		}catch(ex){
			this.set('notification',ex.message);
		}
	},
})