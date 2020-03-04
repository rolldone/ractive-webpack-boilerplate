import Layout from "../Layout";
import BaseRactive from 'BaseRactive';
import template from './views/SupplierNewView.html';
import InputText from '@v1/components/input/Input';
import InputCheckbox from '@v1/components/input/InputCheckbox';
import InputDropdown from '@v1/components/input/InputDropdown';
import InputImport from '@v1/components/input/InputImport';

export const SupplierNew = BaseRactive.extend({
  template,
  components : {
    "input-text" : InputText,
    "input-checkbox" : InputCheckbox,
    "input-dropdown" : InputDropdown,
    "input-import" : InputImport
  },
  data : function(){
    return {
      form_rules : {
        nom : 'required',
        numero_et_rue : 'required',
        code_postal : 'required',
        ville : 'required',
        url_site : 'required',
        email : 'required',
        tel : 'required',
        bussinee_parameter_id : 'required',
        organisation : 'required'
      },
      form_type_select : '',
      categories : {},
      bus_param : [],
      form_data : {},
      type_forms : [],
      conseils_de_preparation_datas : [], 
      submit : gettext("ENREGISTRER"),
    }
  },
  isolate : true,
  onconfig : function(){
    let self = this;
    self._super();
    return new Promise(async function(resolve){
      self.root.findComponent('head-menu').setHeader('page_name',gettext("Créer un Fournisseur"));
      let resBUsCat = await self.getBusParam('FOURNISSEURS_CATEGORY');
      self.setBusCats(resBUsCat);
      resolve();
    })
  },
  oncomplete : function(){
    let self = this;
    this._super();
    self.initSelectionDOM('.ui.checkbox');
    self.initSelectionDOM('.ui.dropdown');
    self.initTextvalidation();
    let closeFormTypeSelect = self.observe('form_type_select',function(newValue,oldValue){
      setTimeout(function(){
        console.log('closeFormTypeSelect reactive');
        self.initSelectionDOM('.ui.dropdown');
        self.initSelectionDOM('.ui.checkbox');
      },2000)
    });
    self.inputImport = self.findComponent('input-import');
    self.inputImport.setOnChangeListener(function(action,props){
      self.setUpdate('form_data',{
        photo : props
      })
    });
  },
  getBusParam : async function(whatCatName){
    try{
      let self = this;
      let url = window.HTTP_REQUEST.BUS_PARAM_XHR.BUS_PARAMS+'?category_name='+whatCatName;
      let resData = await self.getData(url,{});
      return resData;
    }catch(ex){
      console.log('getBusParam -> ',ex);
    }
  },
  setBusCats : function(props){
    let self = this;
    switch(props.status){
      case 'error':
      break;
    }
    self.set('bus_param',props.return);
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
        self.dom_congelation = $('.ui.checkbox.congelation');
        self.dom_consignes = $('.ui.checkbox.consignes')
        self.dom_congelation.checkbox(configCheck);
        self.dom_consignes.checkbox(configCheck);
      break;
      case '.ui.dropdown':
        self.ui_dropdown_select_category = $('.ui.dropdown.select-category');
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
        self.ui_dropdown_select_category.dropdown(ui_dropdown_config);
      break;
    }
  },
  initializeEditor : function(){
    let self = this;
    self.textEditor = $('#editor').summernote({
      callbacks: {
          onChange: function() {
            if(self.pendingChange != null){
              self.pendingChange.cancel();
            }
            self.pendingChange = _.debounce(function(code){
              self.setUpdate('form_data',{
                content : code
              }).then(function(){
                self.initSubmitValidation({
                  content : 'required'
                },function(){})
              })
            },300);
            self.pendingChange(self.textEditor.summernote('code'));
          }
        }  // callback as option 
    });
  },
  handleClick : async function(action,props,e){
    let self = this;
    e.preventDefault();
    switch(action){
      case 'BROWSE_ICON':
        $('input[name=icon_file]').trigger('click');
        $('input[name=icon_file]').on('change',function(e){
          self.set('textgettextcon_file',$(this).val());
          self.setUpdate('form_data',{
            icon_file : $(this)[0].files[0]
          });
        })
      break;
      case 'SUBMIT':
      return self.submitData();
      case 'BACK':
      return window.history.back();
    }
  },
  submitData : function(){
    let self = this;
    let formData = self.objectToFormData(self.get('form_data'));
    let url = window.HTTP_REQUEST.SUPPLIER_XHR.ADD;
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
            // self.ui_dropdown_select_type.dropdown('clear');
            self.ui_dropdown_select_conseils_de_preparation.dropdown('clear');
            self.ui_dropdown_select_contenance.dropdown('clear');
            self.ui_dropdown_select_conditionnement.dropdown('clear');
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
  getMomentDate : function(dateTimeString){
    if(dateTimeString != ""){
      return moment(dateTimeString,'YYYY-MM-DD HH:mm:ss').format('LLL');
    }
  },
  on : {
    setting_key : function(event){
      alert(setting_key);
    }
  }
})

export default Layout({
  BodyContent : SupplierNew
})