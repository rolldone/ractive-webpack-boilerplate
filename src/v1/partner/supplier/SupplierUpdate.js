import { SupplierNew } from "./SupplierNew";
import Layout from "../Layout";
import config from '@config';

export const SupplierUpdate = SupplierNew.extend({
  data : function(){
    return {
      submit : gettext("ENREGISTRER")
    }
  },
  onconfig : function(){
    let self = this;
    self._super();
    self.root.findComponent('head-menu').setHeader('page_name',gettext("Mettre à jour un fournisseur"));  
  },
  oncomplete : function(){
    let self = this;
    self._super();
    return new Promise(async (resolve)=>{
      let resData = await self.getSupplierData();
      self.setSupplierData(resData);
      resolve();
    })
  },
  getSupplierData : async function(){
    let self = this;
    try{
      let url = self.setUrl(window.HTTP_REQUEST.SUPPLIER_XHR.VIEW,[{"{id}": self.root.get('id') }]);
      let resdata = await self.getData(url,{});
      return resdata;
    }catch(ex){
      console.error('getSupplierData - ex ',ex);
      return ex;
    }
  },
  setSupplierData : async function(props){
    let self = this;
    switch(props.status){
      case 'error':
      return console.error('setSupplierData - error ',props);
    }
    console.log('setSupplierData -> ',props);
    await self.set('form_data',props.return);
    let form_data = self.get('form_data');
    let parent = $(self.find('#form-create'));
    window.eachObject(form_data,function(i,key,val){
      switch(key){
        case 'photo':
          setTimeout(function(key){
            let photo = config.API_ASSET_URL+"/storage/fournisseurs/" + val;
            parent.find(`#preview`).attr('src', photo);
          }.bind(self,key),100);
        break;
        default:
          setTimeout(function(key){
            parent.find(`input[name=${key}]`).val(val);
          }.bind(self,key),100)
        break;
      }
    })
  },
  submitData : function(){
    let self = this;
    let formData = self.objectToFormData(self.get('form_data'));
    let url = window.HTTP_REQUEST.SUPPLIER_XHR.UPDATE;
    let current_form_rules = self.get('form_rules');
    self.initSubmitValidation(current_form_rules,function(){
      self.postData(url,formData).then(function(res){
        console.log('res ->',res);
        switch(res.status){
          case 'success':
            swalSuccess(gettext("Édition du fournisseur réalisée"));
            return;
          break;
        }
      })
    })
  },
})

export default Layout({
  BodyContent : SupplierUpdate
})