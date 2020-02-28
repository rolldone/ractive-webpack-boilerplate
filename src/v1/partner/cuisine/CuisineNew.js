import BaseRactive from "BaseRactive";
import CuisinesHttpRequest from "../services/CuisinesHttpRequest";
import Layout from "../Layout";
import template from './views/CuisineNewView.html';
import TabHead from "../../components/tab/TabHead";
import TabPage from "../../components/tab/TabPage";
import InputCheckbox from '@v1/components/input/InputCheckbox.js';
import InputDropdown from '@v1/components/input/InputDropdown.js';
import InputImport from '@v1/components/input/InputImport.js';
import InputText from '@v1/components/input/Input.js';

export const CuisineNew = BaseRactive.extend({
    template,
    components : {
      "tab-head" : TabHead,
      "tab-page" : TabPage,
      "input-text" : InputText,
      "input-checkbox" : InputCheckbox,
      "input-dropdown" : InputDropdown,
      "input-import" : InputImport,
    },
    data : function(){
      return {
        form_rules : {
          nom : 'required',
          description : 'required',
          numero_et_rue : 'required',
          code_postal : 'required',
          ville : 'required',
          email : 'required',
          tel : 'required',
        },
        tabs : [{
          key : 'FORM',
          label : gettext("Créer une nouvelle cuisine")
        }],
        form_type_select : '',
        categories : {},
        bus_param : [],
        form_data : {},
        type_forms : [],
        privilege : [],
        submit : gettext("ENREGISTRER"),
      }
    },
    isolate : true,
    onconfig : function(){
      let self = this;
      self._super();
      self.root.findComponent('head-menu').setHeader('page_name',gettext("Créer un Cuisines"));  
    },
    onrender : function(){
      this._super();
    },
    oncomplete : function(){
      let self = this;
      this._super();
      self.initTextvalidation();
			self.inputImport = self.findComponent('input-import');
			self.inputImport.setOnChangeListener(function(action,props){
					self.setUpdate('form_data',{
					photo : props
					})
			})
    },
    returnCuisinesHttpRequest : function(){
      return new CuisinesHttpRequest();
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
      self.initSubmitValidation(current_form_rules,async function(){
        try{
          let httpRequest = self.returnCuisinesHttpRequest();
          let resData = await httpRequest.addCuisine(self.get('form_data'));
          if(resData.status == "error")
            throw resData.data.responseJSON;
          swalSuccess(gettext('Création réussie'));
          self.set('form_data',{});
          $(self.find('#form-create'))[0].reset();
          self.inputImport.resetPreview();
          /* Clear other semantic lib */
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
  })

export default Layout({
		BodyContent : CuisineNew
})