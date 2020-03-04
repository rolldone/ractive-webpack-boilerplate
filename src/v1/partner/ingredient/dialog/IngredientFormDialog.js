import FormDialog from '@v1/components/FormDialog';
import InputSearchDropdown from '@v1/components/input/InputSearchDropdown';
import InputText from '@v1/components/input/Input';
import InputDropdown from '@v1/components/input/InputDropdown';
import template from './views/IngredientFormDialogView.html';
import IngredientHttpRequest from '@v1/partner/services/IngredientHttpRequest';

export default FormDialog.extend({
  template,
  components : {
    'input-search-dropdown' : InputSearchDropdown,
    'input-text' : InputText,
    'unit-de-mesure' : InputDropdown
  },
  data : function(){
    return {
      submit : gettext("Soumettre"),
      ingredient_datas : [],
      unite_de_mesure_datas : [],
      is_new_ingredient : false,
      action : null,
      form_data : {},
      form_rules : {
        ingredient_id : 'required',
        qty : 'required|numeric',
        unite_de_mesure : 'required'
      }
    }
  },
  returnNewIngredientHttpRequest : function(){
    return new IngredientHttpRequest();
  },
  oncomplete : function(){
    let self = this;
    self.inputSearchDropdown = self.findComponent('input-search-dropdown');
    self.inputSearchDropdown.setOnChangeListener(async function(props,e){
      if(props.value == "new_ingredient"){
        self.set('is_new_ingredient',true);
        await self.setUpdate('form_data',{
          ingredient_id : 0
        })
        await self.setUpdate('form_rules',{
          nom_de_ingredient : 'required',
        })
        await self.getUnitOfMeasure();
        self.inputUnitDeMesure = self.findComponent('unit-de-mesure');
        self.inputUnitDeMesure.setOnChangeListener(function(props,e){
          self.setUpdate('form_data',{
            unite_de_mesure : props.value
          })
        })
      }else{
        await self.set('is_new_ingredient',false);
        let parseValue = JSON.parse(atob(props.value))
        await self.setUpdate('form_data',{
          nom_de_ingredient : parseValue.nom_de_ingredient,
          ingredient_id : parseValue.id,
          unite_de_mesure : parseValue.unite_de_mesure
        })
      }
    },function(settings,callback){
      if(self.pendingDropddownSearch != null){
        self.pendingDropddownSearch.cancel();
      }
      self.pendingDropddownSearch = _.debounce(async function(whatSearch){
        try{
          let httpRequest = self.returnNewIngredientHttpRequest();
          let resData = await httpRequest.getIngredients({
            name : whatSearch
          })
          resData = resData.return;
          let datas = [];
          datas.push({
            value : "new_ingredient",
            name : gettext("Ajouter un nouvel ingrédient")
          })
          for(var a=0;a < resData.length; a++){
            datas.push({
              name : resData[a].nom_de_ingredient,
              value : btoa(JSON.stringify(resData[a]))
            })
          }
          console.log('datas',datas);
          callback({
            success : true,
            results : datas
          });
        }catch(ex){
          console.error('ex - ',ex);
        }
      },100);
      self.pendingDropddownSearch(settings.urlData.query);
    });
  },
  open : async function(ingredientObject){
    window.staticType(ingredientObject,[Object,null]);
    let self = this;
    $(`#${self.get('root_id')}`).modal('show');
    if(ingredientObject != null){
      self.set('action','UPDATE');
      self.set('form_data',ingredientObject);
      return;
    }
    await self.set('action',null);
    await self.set('form_data',{});
    self.oncomplete();
  },
  handleClick : function(action,props,e){
    let self = this;
    if(e != null)
      e.preventDefault();
    switch(action){
      case 'BACK':
        self.dispose();
      break;
      case 'SUBMIT':
        this.initSubmitValidation(self.get('form_rules'),async function(){
          let resData = null;
          if(self.get('is_new_ingredient') == true){
            resData = await self.createNewIngredient();
            resData = resData.return;
          }
          if(resData != null){
            await self.setUpdate('form_data',{
              ingredient_id : resData.id
            })
          }
          console.log('resData',self.get('form_data'));
          self.onFormDialogListener('CALLBACK',self.get('form_data'),null);
        })
      break;
    }
  },
  createNewIngredient : async function(){
    let self = this;
    try{
      let httpRequest = self.returnNewIngredientHttpRequest();
      let resdata = await httpRequest.addIngredient(self.get('form_data'));
      console.log('resdata',resdata);
      return resdata;
    }catch(ex){
      console.error('createNewIngredient - ex ',ex);
    }
  },
  initSubmitValidation : function(form_rule,callback){
    let self = this;
    let currentFormData = self.get('form_data');
    self.submitValidation({
      form_data : self.get('form_data'),
      form_rules : form_rule
    },function(res){
      console.log('res',res);
      let parent = $(self.find('form'));
      console.log('parent',parent);
      window.eachObject(res.error,function(i,key,val){
        switch(key){
          default:
          $.when(parent.find('input[name='+key+']')).done(function(rr){
            console.log('rr',rr);
            rr = rr.parents('.field').first();
            rr.find('span.error').text(val);
          });
          break;
        }
      })
      window.eachObject(res.form_data,function(i,key,val){
        switch(key){
          default:
          $.when(parent.find('input[name='+key+']')).then(function(rr){
              rr = rr.parents('.field').first();
              rr.find('span.error').text('');
          })
          break;
        }
      })
      if(res.status == 'complete'){   
        callback(res.form_data);
      }
    })
  },
  getUnitOfMeasure : async  function(){
    let self = this;
    try{
      let httpRequest = this.returnNewIngredientHttpRequest();
      let resdata = await httpRequest.getUnitOfMeasure();
      self.set('unite_de_mesure_datas',resdata.return);
    }catch(ex){
      console.error('getUnitOfMeasure - ex ',ex);
    }
  },
  getIngredient : async function(id){
    window.staticType(id,[Number]);
    let self = this;
    try{
      let httpRequest = this.returnNewIngredientHttpRequest();
      let resData = await httpRequest.getIngredient(id);
      self.set('form_data',resData.return);
    }catch(ex){
      console.log('getIngredient - ex ',ex);
    }
  },
  getDatas : async function(){
    try{
      let httpRequest = this.returnNewIngredientHttpRequest();
      let resData = await httpRequest.getIngredients();
      return resData;
    }catch(ex){
      console.error('getDatas - ex ',ex);
    }
  },
  setDatas : function(props){
    window.staticType(props,[Object,null]);
    if(props == null)
      return;
  }
})