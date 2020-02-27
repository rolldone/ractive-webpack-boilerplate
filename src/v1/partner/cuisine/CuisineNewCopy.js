import Layout from "../Layout";
import { CuisineUpdate } from "./CuisineUpdate";
import config from '@config';
export const CuisineNewCopy = CuisineUpdate.extend({
	data : function(){
		return {
			tabs : [{
				key : 'FORM',
				label : gettext("Mettre à jour un cuisine")
			}],
		}
	},
	setCuisine : async function(props){
		let self = this;
		switch(props.status){
			case 'error':
			console.error('setCuisine - err ',props);
			return;
		}
		await self.set('form_data',props.return);
		let form_data = self.get('form_data');
		let rootDom = $(self.find('#form-create'));
		window.eachObject(form_data,function(i,key,value){
			switch(key){
				case 'photo':
					let photo = config.API_ASSET_URL+"/storage/cuisine/" + value;
					rootDom.find(`#preview`).attr('src', photo);
				break;
				default:
					rootDom.find('input[name='+key+']').val(value);
				break;
			}
		});
		self.initTextvalidation();
	},
	submitData : async function(){
		let self = this;
		let current_form_rules = self.get('form_rules');
		let url = window.HTTP_REQUEST.CUISINE_XHR.ADD;
		self.initSubmitValidation(current_form_rules,async function(){
			try{
				let httpRequest = self.returnCuisinesHttpRequest();
				let resData = await httpRequest.addCuisine(self.get('form_data'));
				if(resData.status == "error")
					throw resData.data.responseJSON;
				swalSuccess(gettext('Création réussie'),'',function(){
					self.set('form_data',{});
					$(self.find('#form-create'))[0].reset();
					self.inputImport.resetPreview();
					self.dispatch(self.setUrl(self.routeName('cuisine.view'),[{":id":resData.return.id}]),{ noHistory : true });
					// window.location.replace(self.setUrl(window.HTTP_REQUEST.CUISINE.VIEW,[{"{id}": resData.return.id }]));
				});
			}catch(ex){
				console.error('submitData - ex ',ex);
			}
		})
	},
})

export default Layout({
	BodyContent : CuisineNewCopy
})