import Layout from "../Layout";
import ProductNew from "./partials/ProductNew";
import { ProductTabNewCopy } from "./ProductTabNewCopy";

/* Override Product New Copy */
var ProductSelfNewCopy = ProductNew.extend({
  submitData : function(){
    let self = this;
    self.setUpdate('form_data',{
      id : self.root.get('id')
    })
    let formData = self.objectToFormData(self.get('form_data'));
    let url = window.HTTP_REQUEST.PRODUCT_XHR.ADD;
    let current_form_rules = self.get('form_rules');
    self.initSubmitValidation(current_form_rules,function(){
      self.postData(url,formData).then(function(res){
        console.log('res ->',res);
        switch(res.status){
          case 'success':
            swalSuccess('Success',gettext("Produit ajouté!"),function(){
              self.dispatch(self.setUrl(self.routeName('product.self.view'),[{":id":res.return.id}]));
            });
            return;
          break;
        }
      })
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

