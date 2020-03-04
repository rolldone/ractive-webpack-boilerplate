import Layout from "../Layout";
import template from './views/PrivilegeNewView.html';
import InputText from '@v1/components/input/Input';
import InputCheckbox from '@v1/components/input/InputCheckbox';
import InputDropdown from '@v1/components/input/InputDropdown';
import BaseRactive from 'BaseRactive';

export const PrivilegeNew = BaseRactive.extend({
  template,
  components : {
    "input-text" : InputText,
    "input-checkbox" : InputCheckbox,
    "input-dropdown" : InputDropdown
  },
  data : function(){
    return {
      form_rules : {
        name : 'required',
        description : 'required',
      },
      form_type_select : '',
      categories : {},
      bus_param : [],
      form_data : {},
      type_forms : [],
      privilege_items : [],
      submit : gettext("ENREGISTRER"),
      privilege_datas : []
    }
  },
  isolate : true,
  onconfig : function(){
    let self = this;
    self._super();
    self.root.findComponent('head-menu').setHeader('page_name',gettext("Créer une niveau d'accès"));  
  },
  onrender : function(){
    this._super();
  },
  oncomplete : function(){
    let self = this;
    this._super();
    return new Promise( async (resolve)=>{
      self.setBelowGroupId(await self.getBelowGroupId());
      self.initSelectionDOM('.ui.checkbox');
      self.initSelectionDOM('.ui.dropdown');
      self.initTextvalidation();
      let resData = await self.getPrivilegeItem();
      self.setPrivilegeItem(resData);
      resolve();
    })
  },
  initSelectionDOM : function(action){
    let self = this;
    switch(action){
      case '.ui.checkbox':
        var configCheck = {
          onChange : function(){
            let isChecked = $(this).is(':checked')==true?1:0;
            let theValue = {};
            theValue[$(this).attr('name')] = isChecked;
            self.setUpdate('form_data',theValue);
          }
        }
      break;
      case '.ui.dropdown':
        var ui_dropdown_config = {
          onChange : function(value, text, $choice){
            console.log('value',value);
            console.log('text',text);
            console.log('key',$($choice).attr('data-key'));
            let hidden = $($choice).parent();
            hidden = hidden.siblings('input[type=hidden]');
            let name = hidden.attr('name');
            let dataKey = $($choice).attr('data-key');
            let newData = {};
            newData[name] = value;
            self.setUpdate('form_data',newData);
          }
        }
        self.below_group_id = $('#below_group_id').dropdown(ui_dropdown_config);
      break;
    }
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
    // Get Privilege Items
    let resKeyChoose = await self.eachPrivilegeItems();
    await self.setUpdate('form_data',{
      keys : JSON.stringify(resKeyChoose)
    })
    let formData = self.objectToFormData(self.get('form_data'));
    let url = window.HTTP_REQUEST.PRIVILEGE_XHR.ADD;
    self.initSubmitValidation(current_form_rules,function(){
      self.postData(url,formData).then(function(res){
        console.log('res ->',res);
        switch(res.status){
          case 'success':
            swalSuccess(gettext('Création réussie'));
            self.set('form_data',{});
            $(self.find('#form-create'))[0].reset();
            // Clear other semantic lib
            return;
          break;
        }
      })
    })
  },
  initTextvalidation : function(){
    let self = this;
    self.inputTextValidation(self.find('#form-create'),{
      form_data : self.get('form_data'),
      form_rules : self.get('form_rules'),
      element_target : 'input[type=text],input[type=email],input[type=number],textarea'
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
  getPrivilegeItem : async function(){
    let self = this;
    let url = window.HTTP_REQUEST.PRIVILEGE_XHR.PRIVILEGE_ITEMS;
    let resData = await self.getData(url,{});
    console.log('getPrivilegeItem -> ',resData);
    return resData;
  },
  setPrivilegeItem : function(props){
    let self = this;
    switch(props.status){
      case 'error':
      return console.error('setPrivilegeItem - error ',props);
    }
    self.set('privilege_items',props.return);
  },
  getBelowGroupId : async function(){
    let self = this;
    try {
      let url = window.HTTP_REQUEST.PRIVILEGE_XHR.PRIVILEGES;
      let resData = await self.getData(url,{});
      console.log('resData',resData);
      return resData;
    }catch(ex){
      console.error('getDatas -> ',ex);
    } 
  },
  setBelowGroupId : async function(props){
    let self = this;
    switch(props.status){
      case 'error':
      return console.error('setDatas - e ',props);
    }
    await self.set('privilege_datas',props.return);
  },
})

export default Layout({
  BodyContent : PrivilegeNew
})