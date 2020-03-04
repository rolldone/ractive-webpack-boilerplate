import Layout from "../Layout";
import { ProductTabNewCopy } from "./ProductTabNewCopy";
import { ProductSelfUpdate } from "./ProductTabSelfUpdate";

/* Override Product New Copy */
var ProductSelfNewCopy = ProductSelfUpdate.extend({
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
				swalSuccess(gettext('Création réussie'));
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

/* Override BodyContent */
export const ProductTabSelfNewCopy = ProductTabNewCopy.extend({
  components : {
    "product-new" : ProductSelfNewCopy
  },
})

export default Layout({
    BodyContent : ProductTabSelfNewCopy
})

