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
	submitData : async function(){
		let self = this;
		await self.setUpdate('form_data',{
			ingredient_datas : self.get('ingredient_datas').length > 0 ? JSON.stringify(self.get('ingredient_datas')):null
		})
		let current_form_rules = self.get('form_rules');
		self.initSubmitValidation(current_form_rules,async function(){
			try{
				let httpRequest = self.returnPlatsHttpRequest();
				let resData = await httpRequest.addPlats(self.get('form_data'));
				swalSuccess(gettext("Création réussie"));
				self.set('form_data',{});
				$(self.find('#form-create'))[0].reset();
				self.inputImport.resetPreview();
				self.ui_dropdown_select_category.dropdown('clear');
				self.ui_dropdown_select_type.dropdown('clear');
				self.ui_dropdown_select_conseils_de_preparation.dropdown('clear');
				self.ui_dropdown_select_contenance.dropdown('clear');
				self.ui_dropdown_select_conditionnement.dropdown('clear');
			}catch(ex){
				console.error('submitData - ex ',ex);
			}
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