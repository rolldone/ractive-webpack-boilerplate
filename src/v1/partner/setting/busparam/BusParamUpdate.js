import { BusParamNew } from "./BusParamNew";
import Layout from "../../Layout";

export const BusParamUpdate = BusParamNew.extend({
  components : {},
  data : function(){
    return {
      submit : gettext("ENREGISTRER"),
    }
  },
  onconfig : function(){
    this._super();
    this.root.findComponent('head-menu').setHeader('page_name',gettext("Mettre à jour un Catégories"));
    
  },
  onrender : function(){
    this._super();
  },
  oncomplete : function(){
    let self = this;
    this._super();
    return new Promise(async (resolve)=>{
      let resData = await self.getItem();
      self.setItem(resData);
      self.initTextvalidation();
      resolve();
    })
  },
  getItem : async function(){
    let self = this;
    try{
      let url = self.setUrl(window.HTTP_REQUEST.BUS_PARAM_XHR.VIEW,[{'{id}': self.root.get('id') }]);
      let resData = await self.getData(url,{});
      return resData;
    }catch(ex){
      console.error('getItem -> ',ex);
    }
  },
  setItem : function(props){
    let self = this;
    switch(props.status){
      case 'error':
      return;
    }
    let currentProps = props.return;
    self.set('form_data',currentProps).then(function(){
      let form_data = self.get('form_data');
      let rootDom = $(self.find('#form-create'));
      window.eachObject(form_data,function(i,key,val){
        switch(key){
          case 'bussinee_parameter_category_key':
            self.ui_dropdown_bus_parameter.dropdown('set selected',val+'');
          break;
          case "status":
            if(val == 1){
              self.ui_checkbox_status.checkbox('set checked',val);
            }
          break
          default:
            rootDom.find('input[name='+key+']').val(val);
          break;
        }
      })
    });
  },
  submitData : function(){
    let self = this;
    self.setUpdate('form_data',{
      id : self.root.get('id')
    })
    let formData = self.objectToFormData(self.get('form_data'));
    let url = window.HTTP_REQUEST.BUS_PARAM_XHR.UPDATE;
    let current_form_rules = self.get('form_rules');
    self.initSubmitValidation(current_form_rules,function(){
      self.postData(url,formData).then(function(res){
        console.log('res ->',res);
        switch(res.status){
          case 'success':
            swalSuccess(gettext("Édition des paramêtres réalisée"));
            return;
          break;
        }
      })
    })
  },
  on : {
    setting_key : function(event){
      alert(setting_key);
    }
  }
})

export default Layout({
  BodyContent : BusParamUpdate
})