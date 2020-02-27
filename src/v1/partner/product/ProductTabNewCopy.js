import Layout from "../Layout";
import ProductUpdate from "./partials/ProductUpdate";
import { ProductTabNew } from "./ProductTabNew";
import ProductCuisine from "./partials/ProductCuisine";

/* Override partial product update */ 
var ProductNewCopy = ProductUpdate.extend({
	onconfig : function(){
		let self = this;
		self._super();
		this.root.findComponent('head-menu').setHeader('page_name',gettext("Produit en double"));
	},
	submitData : function(){
		let self = this;
		self.setUpdate('form_data',{
			id : self.root.get('id')
		})
		console.log('form_data',self.get('form_data'));
		let formData = self.objectToFormData(self.get('form_data'));
		let url = window.HTTP_REQUEST.PRODUCT_XHR.ADD;
		let current_form_rules = self.get('form_rules');
		self.initSubmitValidation(current_form_rules,function(){
			self.postData(url,formData).then(function(res){
				console.log('res ->',res);
				switch(res.status){
					case 'success':
						swalSuccess('Success',gettext("Produit ajouté!"),function(){
							self.dispatch(self.setUrl(self.routeName('product.view'),[{":id":res.return.id}]))
						});
						return;
					break;
				}
			})
		})
	},
})

/* BodyContent */
export const ProductTabNewCopy = ProductTabNew.extend({
	components : {
		"product-new" : ProductNewCopy,
		"product-cuisine" : ProductCuisine
	},
	data : function(){
		return {
			submit : 'ENREGISTRER',
			tabs : [{
				key : 'FORM',
				label : gettext("Créer une nouvelle plat")
			}],
		}
	},
	onconfig : function(){
		let self = this;
		self._super();
		this.root.findComponent('head-menu').setHeader('page_name',gettext("Enregistrer Product"));
	},
})

export default Layout({
		BodyContent : ProductTabNewCopy
})