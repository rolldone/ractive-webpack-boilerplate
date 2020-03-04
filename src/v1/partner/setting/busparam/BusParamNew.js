import BaseRactive from 'BaseRactive';
import Layout from '../../Layout';
import template from './views/BusParamNewView.html';

export const BusParamNew = BaseRactive.extend({
  template,
  components : {},
  data : function(){
    return {
      form_rules : {
        key : 'required',
        value : 'required',
        description : 'required',
        status : 'required',
        bussinee_parameter_category_key : 'required',
      },
      categories : {},
      bus_cats : [],
      form_data : {},
      submit : gettext("ENREGISTRER"),
    }
  },
  isolate : true,
  onconfig : function(){
    let self = this;
    this._super();
    return new Promise(async (resolve)=>{
      this.root.findComponent('head-menu').setHeader('page_name',gettext("Ajouter un Catégories"));
      let resBUsCat = await self.getBusCats();
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
  },
  getBusCats : async function(){
    try{
      let self = this;
      let url = window.HTTP_REQUEST.BUS_PARAM_CAT_XHR.BUS_PARAM_CATS;
      let resData = await self.getData(url,{});
      return resData;
    }catch(ex){
      console.log('getBusCats -> ',ex);
    }
  },
  setBusCats : function(props){
    let self = this;
    switch(props.status){
      case 'error':
      break;
    }
    self.set('bus_cats',props.return);
  },
  initSelectionDOM : function(action){
    let self = this;
    switch(action){
      case '.ui.checkbox':
        self.ui_checkbox_status = $('.ui.checkbox.dom_is_status');
        self.ui_checkbox_status.checkbox({
          onChange : function(){
            let isChecked = $(this).is(':checked')==true?1:0;
            let theValue = {};
            theValue[$(this).attr('name')] = isChecked;
            self.setUpdate('form_data',theValue);
          }
        });
      break;
      case '.ui.dropdown':
        self.ui_dropdown_bus_parameter = $('.ui.dropdown.select-bus-parameter');
        var ui_dropdown_config = {
          onChange : function(value, text, $choice){
            console.log('value',value);
            console.log('text',text);
            let hidden = $($choice).parent();
            hidden = hidden.siblings('input[type=hidden]');
            let name = hidden.attr('name');
            let newData = {};
            newData[name] = value;
            self.setUpdate('form_data',newData);
          }
        }
        self.ui_dropdown_bus_parameter.dropdown(ui_dropdown_config);
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
    let url = window.HTTP_REQUEST.BUS_PARAM_XHR.ADD;
    let current_form_rules = self.get('form_rules');
    self.initSubmitValidation(current_form_rules,function(){
      self.postData(url,formData).then(function(res){
        console.log('res ->',res);
        switch(res.status){
          case 'success':
            swalSuccess(gettext("Création réussie"));
            self.set('form_data',{});
            $(self.find('#form-create'))[0].reset();
            self.ui_dropdown_bus_parameter.dropdown('clear');
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
  newOn : {
    setting_key : function(event){
      alert(setting_key);
    }
  }
})

export default Layout({
  BodyContent : BusParamNew
})