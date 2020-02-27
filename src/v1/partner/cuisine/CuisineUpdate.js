import { CuisineNew } from "./CuisineNew";
import Layout from "../Layout";
import CuisineUser from "./partials/CuisineUser";
import config from '@config';

export const CuisineUpdate = CuisineNew.extend({
	components : {
		"cuisine-users" : CuisineUser
	},
	data : function(){
		return {
			tabs : [{
				key : 'FORM',
				label : gettext("Mettre à jour un cuisine")
			},{
				key : 'CUISINE_USER',
				label : 'Cuisine Users'
			}],
		}
	},
	onconfig : function(){
		let self = this;
		self._super();
		self.root.findComponent('head-menu').setHeader('page_name',gettext("Mettre à jour un cuisine"));  
	},
	oncomplete : function(){
		let self = this;
		self._super();
		return new Promise(async function(resolve){
			let resData = await self.getCuisine();
			self.setCuisine(resData);
			/*Get ref tab component*/
			self.tab = self.findComponent('tab-head');
			self.tab.setOnClickListener(async function(resData,index){
				if(index == 0){
					self.setCuisine(resData);
				}
			}.bind(self,resData))
			resolve();
		})
	},
	submitData : async function(){
		let self = this;
		let current_form_rules = self.get('form_rules');
		self.initSubmitValidation(current_form_rules,async function(){
			try{
				let httpRequest = self.returnCuisinesHttpRequest();
				let resData = await httpRequest.updateCuisine(self.get('form_data'));
				if(resData.status == "error")
					throw resData.data.responseJSON;
				swalSuccess(gettext('Édition de la cuisine réalisée'));
			}catch(ex){
				console.error('submitData - ex ',ex);
			}
		})
	},
	getCuisine : async function(){
		let self = this;
		try{
			let httpRequest = self.returnCuisinesHttpRequest();
			let resData = await httpRequest.getCuisine(self.root.get('id'));
			return resData;
		}catch(ex){
			console.error('getCuisine - err ',ex);
			return null;
		}
	},
	setCuisine : async function(props=null){
		let self = this;
		if(props == null)
			return;
		await self.set('form_data',props.return);
		let form_data = self.get('form_data');
		let rootDom = $(self.find('#form-create'));
		window.eachObject(form_data,function(i,key,value){
			switch(key){
				case 'photo':
					let photo =  config.API_ASSET_URL+"/storage/cuisine/" + value;
					rootDom.find(`#preview`).attr('src', photo);
				break;
				default:
					rootDom.find('input[name='+key+']').val(value);
				break;
			}
		});
		self.initTextvalidation();
	}
})

export default Layout({
	BodyContent : CuisineUpdate
})