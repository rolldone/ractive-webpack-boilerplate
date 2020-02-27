import Layout from "../Layout";
import { ProductTabUpdate } from "./ProductTabUpdate";
import ProductUpdate from "./partials/ProductUpdate";

/* Override Product Update */
var ProductSelfUpdate = ProductUpdate.extend({
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
	submitData : function(){
		let self = this;
		self.setUpdate('form_data',{
			id : self.root.get('id')
		})
		let formData = self.objectToFormData(self.get('form_data'));
		let url = window.HTTP_REQUEST.PRODUCT_XHR.SELF_UPDATE;
		let current_form_rules = self.get('form_rules');
		self.initSubmitValidation(current_form_rules,function(){
			self.postData(url,formData).then(function(res){
				switch(res.status){
					case 'success':
						swalSuccess(gettext("Édition du plat réalisée"));
						return;
					break;
				}
			})
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