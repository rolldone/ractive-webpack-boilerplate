import Layout from "../Layout";
import { UserNew } from "./UserNew";
import UserHttpRequest from "../services/UserHttpRequest";

var BodyContent = UserNew.extend({
    data : function(){
        return {
            title_form : "Mettre à jour un utilisateur",
            form_rules : {
                nom : 'required',
                prenom : 'required',
                email : 'required',
                group_id : 'required',
                status : 'required',
            },
            form_rules_password : {
                password : 'required|min:8',
                password_confirm : 'required|min:8|same:password'
            },
            is_email_disabled: true
        }
    },
    oncomplete : function(){
				let self = this;
				self._super();
        return new Promise(async function(resolve){
					self.initTextPasswordValidation();
					let resdata = await self.getUser();
					self.setUser(resdata);
					self.root.findComponent('head-menu').setHeader('page_name',gettext("Mettre à jour un utilisateur"));  
				})
    },
    getUser : async function(){
        try{
						var user = new UserHttpRequest();
            return await user.getUser(this.root.get('id'),{});
        }catch(ex){
            console.error('getUser - ex ',ex);
        }
    },
    setUser : async function(props){
        let self = this;
        switch(props.status){
            case 'error':
            return console.error('setUser - error ',props);
				}
				console.log('mvkdfmv',props);
        await self.set('form_data',props.return);
        var form_data = self.get('form_data');
				var parent = $(self.find('form')).first();
				window.eachObject(form_data,function(i,key,val){
					switch(key){
						case 'group_id':
						case 'status':
							self[`ui_dropdown_${key}`].dropdown('set selected',val+'');
						break;
						case 'photo':
							let photo = self.asset("/storage/user/" + val);
							parent.find(`#preview`).attr('src', photo);
						break;
						default:
							parent.find(`input[name=${key}]`).val(val);
					}
				})
    },
    submitData : function(){
			let self = this;
			let formData = self.objectToFormData(self.get('form_data'));
			let url = window.HTTP_REQUEST.USER_XHR.UPDATE;
			let current_form_rules = self.get('form_rules');
			var initSubmitValidation = self.initSubmitValidation.bind(self,current_form_rules,function(){
				self.postData(url,formData).then(function(res){
					console.log('res ->',res);
					switch(res.status){
						case 'success':
							swalSuccess('Success',gettext("Utilisateur mis à jour!"));
							return;
						break;
					}
				})
			})
			if(self.get('form_data').password != null){
								self.initSubmitValidation(self.get('form_rules_password'),initSubmitValidation)
					return;
			}
			initSubmitValidation();
		},
})

export default Layout({
	BodyContent
})