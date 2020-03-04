import BaseRactive from 'BaseRactive';
import InputText from '@v1/components/input/Input';
import InputDropdown from '@v1/components/input/InputDropdown';
import ImportDocument from '@v1/components/input/InputImportDocument';
import InputSearchDropdown from '@v1/components/input/InputSearchDropdown';
import Layout from '../Layout';
import CuisinerHttpRequest from '../services/CuisinerHttpRequest';
import template from './views/CuisinerNewView.html';
import CuisinesHttpRequest from '../services/CuisinesHttpRequest';

export const CuisinerNew = BaseRactive.extend({
  template,
  components : {
    "input-text" : InputText,
    "input-dropdown" : InputDropdown,
    "import-document" : ImportDocument,
    "input-search-dropdown" : InputSearchDropdown
  },
  data : function(){
    return {
      form_rules : {
        nom : 'required',
        prenom : 'required',
        status : 'required',
        phone_number : 'required',
        email : 'required|email',
      },
      status_datas : [{
        text : 'Activated',
        id : 1
      },{
        text : 'Pending',
        id : 0
      },{
        text : 'Disabled',
        id : 2
      }],
      form_type_select : '',
      categories : {},
      bus_param : [],
      form_data : {},
      type_forms : [],
      privilege_items : [],
      submit : gettext("ENREGISTRER"),
    }
  },
  isolate : true,
  onconfig : function(){
    let self = this;
    self._super();
    self.root.findComponent('head-menu').setHeader('page_name',gettext("Créer un Cuisinier"));  
  },
  onrender : function(){
    this._super();
  },
  oncomplete : function(){
    let self = this;
    this._super();
    return new Promise(async (resolve)=>{
      self.initTextvalidation();
      self.inputImport = self.findComponent('import-document');
      self.inputImport.setOnChangeListener(function(action,props){
        self.setUpdate('form_data',{
          photo : props
        })
      })
      let resCuisinesDatas = await self.getCuisineDatas();
      await self.setCuisinesDatas(resCuisinesDatas);
      self.dropdownChangeListener = function(val,e){
        self.setUpdate('form_data',{
          [val.name] : val.value
        })
      }
      self.cuisines_dropdown = self.findComponent('input-search-dropdown');
      self.cuisines_dropdown.setOnChangeListener(self.dropdownChangeListener.bind(self));
      self.status_dropdown = self.findComponent('input-dropdown');
      self.status_dropdown.setOnChangeListener(self.dropdownChangeListener.bind(self));
      resolve();
    })
  },
  handleClick : async function(action,props,e){
    let self = this;
    e.preventDefault();
    switch(action){
      case 'SUBMIT':
      return self.submitData();
      case 'BACK':
      return window.history.back();
    }
  },
  eachPrivilegeItems : function(){
    let self = this;
    return new Promise(function(resolve,reject){
      let put_keys = [];
      let privItems = $(self.find('#form-create'));
      let pendingTime = 0;
      privItems = privItems.find('input[type=checkbox]');
      privItems.each(function(i,dom){
        if($(dom).is(':checked') == true){
          put_keys.push($(dom).val());
        }
      })
      resolve(put_keys);
    })
  },
  submitData : async function(){
    let self = this;
    let current_form_rules = self.get('form_rules');
    self.initSubmitValidation(current_form_rules,async function(){
      try{
        let httpRequest = new CuisinerHttpRequest();
        let resData = await httpRequest.addCuisiner(self.get('form_data'));
        if(resData.status == "error")
          throw resData;
        swalSuccess(gettext("Création réussie"));
        self.set('form_data',{});
        $(self.find('#form-create'))[0].reset();
        self.inputImport.resetPreview();
        /*Clear other semantic lib*/
      }catch(ex){
        console.error('submitData - ex ',ex);
      }
    })
  },
  initTextvalidation : function(){
    let self = this;
    self.inputTextValidation(self.find('#form-create'),{
      form_data : self.get('form_data'),
      form_rules : self.get('form_rules'),
      element_target : 'input[type=file],input[type=text],input[type=email],input[type=number],textarea'
    },function(res,e){
      self.setUpdate('form_data',res.form_data).then(function(){
        let parent = $(e.target).parents('.field').first();
        switch(res.status){
          case 'error':
          return parent.find('span.error').text(res.message);
          case 'valid':
          case 'complete':
          return parent.find('span.error').text('');
        }
      })
    })
  },
  initSubmitValidation : function(form_rule,callback){
    let self = this;
    console.log('self',self.get('form_data'))
    let currentFormData = self.get('form_data');
    self.submitValidation({
      form_data : self.get('form_data'),
      form_rules : form_rule
    },function(res){
      console.log('res',res);
      let parent = $(self.el);// $(self.find('#form-create'));
      for(var key in res.error){
        switch(key){
          default:
          var fixKey = key;
          $.when(parent.find('input[name='+fixKey+']')).done(function(rr){
            rr = rr.parents('.field').first();
            rr.find('span.error').text(res.error[fixKey]);
          });
          break;
        }
      }
      for(var key in res.form_data){
        switch(key){
          default:
          var fixKey = key;
          $.when(parent.find('input[name='+fixKey+']')).then(function(rr){
              rr = rr.parents('.field').first();
              rr.find('span.error').text('');
          })
          break;
        }
      }
      if(res.status == 'complete'){   
        callback(res.form_data);
      }
    })
  },
  getCuisineDatas : async function(){
    let self = this;
    try{
      let httpRequest = new CuisinesHttpRequest();
      let resDatas = await httpRequest.getCuisines({});
      if(resDatas.status == "error")
        throw ex;
      return resDatas;
    }catch(ex){
      console.error('getCuisineDatas - ex ',ex);
    }
  },
  setCuisinesDatas : async function(props){
    window.staticType(props,[Object]);
    let self = this;
    await self.set('cuisines_datas',props.return);
  }
})

export default Layout({
  BodyContent : CuisinerNew
})