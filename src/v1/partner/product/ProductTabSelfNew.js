import { ProductTabNew } from "./ProductTabNew";
import Layout from "../Layout";
import ProductNew from "./partials/ProductNew";

/* Override Product New */
var ProductSelfNew = ProductNew.extend({
	submitData : function(){
		let self = this;
		let formData = self.objectToFormData(self.get('form_data'));
		let url = window.HTTP_REQUEST.PRODUCT_XHR.SELF_ADD;
		let current_form_rules = self.get('form_rules');
		self.initSubmitValidation(current_form_rules,function(){
			self.postData(url,formData).then(function(res){
				console.log('res ->',res);
				switch(res.status){
					case 'success':
						swalSuccess(gettext('Création réussie'));
						self.set('form_data',{});
						$(self.find('#form-create'))[0].reset();
						self.inputImport.resetPreview();
						self.ui_dropdown_select_category.dropdown('clear');
						self.ui_dropdown_select_type.dropdown('clear');
						self.ui_dropdown_select_conseils_de_preparation.dropdown('clear');
						self.ui_dropdown_select_contenance.dropdown('clear');
						self.ui_dropdown_select_conditionnement.dropdown('clear');
						return;
					break;
				}
			})
		})
	},
})

/* Override BodyContent */
export const ProducTabSelfNew = ProductTabNew.extend({
	components : {
		"product-new" : ProductSelfNew,
	},
})

export default Layout({
	BodyContent : ProducTabSelfNew
})