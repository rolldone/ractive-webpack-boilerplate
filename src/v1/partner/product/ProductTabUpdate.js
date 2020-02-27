import { ProductTabNew } from "./ProductTabNew";
import Layout from "../Layout";
import ProductUpdate from "./partials/ProductUpdate";
import ProductCuisine from "./partials/ProductCuisine";

export const ProductTabUpdate = ProductTabNew.extend({
	components : {
		"product-new" : ProductUpdate,
		"product-cuisine" : ProductCuisine
	},
	data : function(){
		return {
			tabs : [{
				key : 'FORM',
				label : gettext("Créer une nouvelle plat")
			},{
				key : 'PRODUCT_CUISINES',
				label : gettext("Plats Cuisines")
			}],
			form_rules : {
				nom : 'required',
				category : 'required',
			},
			form_type_select : '',
			categories : {},
		}
	},
	isolate : true,
	onconfig : function(){
		let self = this;
		self._super();
		self.root.findComponent('head-menu').setHeader('page_name',gettext("Ajouter un nouveau produit"));
	},
})

export default Layout({
	BodyContent : ProductTabUpdate
})