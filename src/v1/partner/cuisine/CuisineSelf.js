import BaseRactive from "BaseRactive";
import CuisineUserComponent from './partials/CuisineUser.js';
import Layout from "../Layout.js";
import { CuisineUpdate } from "./CuisineUpdate.js";
import SelfCuisineHttpRequest from "../services/SelfCuisineHttpRequest.js";

const CuisineUserSelfComponent = CuisineUserComponent.extend({
    returnCuisineHttpRequest : function(){
			return new SelfCuisineHttpRequest();
    },
    getDatas : async function(){
			let self = this;
			try {
				let httpRequest = self.returnCuisineHttpRequest();
				let resData = await httpRequest.getCuisineUsers();
				return resData;
			}catch(ex){
				console.error('getDatas -> ',ex);
			} 
    },
})

export const CuisineSelf = CuisineUpdate.extend({
    components : {
			"cuisine-users" : CuisineUserSelfComponent
    },
    returnCuisineHttpRequest : function(){
			return new SelfCuisineHttpRequest();
    },
    getCuisine : async function(){
			let self = this;
			try{
				let cuisineHttp = self.returnCuisineHttpRequest();
				let resData = await cuisineHttp.getCuisine();
				if(resData.status == "error")
						throw resData.data.responseJSON;
				return resData;
			}catch(ex){
				console.error('getData -> ',ex);
				swalFailure(gettext("Error"),ex.return.message);
			}
    },
    submitData : async function(){
			let self = this;
			try{
				let cuisineHttp = self.returnCuisineHttpRequest();
				let resData = await cuisineHttp.updateCuisine(self.get('form_data'));
				switch(resData.status){
						case 'error':
						resData = resData.data.responseJSON;
						swalFailure(gettext("Échec de la mise à jour de l'auto-cuisine"),resData.return.message)
						throw resData;
						return;
				}
				swalSuccess(gettext("Mise à jour de l'auto-cuisine réussie"));
			}catch(ex){
				console.error('updateCuisine -> ex ',ex);
			}
    }
})

export default Layout({
    BodyContent : CuisineSelf
})