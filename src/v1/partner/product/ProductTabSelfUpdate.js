import Layout from "../Layout";
import { ProductTabUpdate } from "./ProductTabUpdate";
import ProductUpdate from "./partials/ProductUpdate";
import SelfPlatsHttpRequest from "../services/SelfPlatsHttpRequest";

/* Override Product Update */
export const ProductSelfUpdate = ProductUpdate.extend({
	data : function(){
		return {
			form_rules : {
				nom : 'required',
				category : 'required',
				ingredient_datas : 'required',
				/* Removed Because is self product */
				/* cuisine_id : 'required|numeric' */
			},
		}
	},
	returnPlatHttpRequest : function(){
		return new SelfPlatsHttpRequest();
	},
	getItem : async function(){
		let self = this;
		try{
			let url = self.setUrl(window.HTTP_REQUEST.PRODUCT_XHR.SELF_VIEW,[{'{id}':self.root.get('id')}]);
			let resData = await self.getData(url,{});
			return resData;
		}catch(ex){
			console.error('getItem -> ',ex);
		}
	},
	submitData : async function(){
		let self = this;
		self.setUpdate('form_data',{
			id : self.root.get('id')
		})
		await self.setUpdate('form_data',{
			ingredient_datas : self.get('ingredient_datas').length > 0 ? JSON.stringify(self.get('ingredient_datas')):null
		})
		let current_form_rules = self.get('form_rules');
		self.initSubmitValidation(current_form_rules,async function(){
			try{
				let httpRequest = self.returnPlatHttpRequest();
				let resData = await httpRequest.updatePlats(self.get('form_data'));
				swalSuccess(gettext("Édition du plat réalisée"));
			}catch(ex){
				console.error('submitData - ex ',ex);
			}
		})
	},
})
/* Override BodyContent */
export const ProductTabSelfUpdate = ProductTabUpdate.extend({
	components : {
		"product-new" : ProductSelfUpdate,
	},
	data : function(){
		return {
			tabs : [{
				key : 'FORM',
				label : gettext("Créer une nouvelle plat")
			}],
		}
	}
})

export default Layout({
	BodyContent : ProductTabSelfUpdate
})