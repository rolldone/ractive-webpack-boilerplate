import BaseRactive from "BaseRactive";
import Layout from "../Layout";
import template from './views/IngredientNewView.html';
import InputText from '@v1/components/input/Input';
import InputDropdown from '@v1/components/input/InputDropdown';
import TabHead from '@v1/components/tab/TabHead';
import TabPage from '@v1/components/tab/TabPage';
import IngredientHttpRequest from "../services/IngredientHttpRequest";

export const IngredientNew = BaseRactive.extend({
  template,
  components : {
    "tab-head" : TabHead,
    "tab-page" : TabPage,
    "input-text" : InputText,
    "measure-dropdown" : InputDropdown
  },
  data : function(){
    return {
      form_rules : {
        nom_de_ingredient : 'required',
        unite_de_mesure : 'required',
      },
      tabs : [{
				key : 'FORM',
				label : gettext("Créer un nouvel ingrédient alimentaire")
      }],
      submit : gettext('Soumettre')
    }
  },
  oncomplete : function(){
    let self = this;
    self._super();
    return new Promise(async (resolve)=>{
      self.initTextvalidation();
      self.setUnitOfMeasure(await self.getUnitOfMeasure());
      self.tab_form = self.findComponent('tab-head');
      self.tab_form.setOnClickListener(function(tabNumber){
        if(tabNumber == 0){
          self.oncomplete();
        }
      })
      self.measure_dropdown = self.findComponent('measure-dropdown');
      self.measure_dropdown.setOnChangeListener(function(val,e){
        self.setUpdate('form_data',{
          unite_de_mesure : val.value
        })
      })
      resolve();
    })
  },
  returnNewIngredientHttpRequest : function(){
    return new IngredientHttpRequest();
  },
  getUnitOfMeasure : async function(){
    let self = this;
    try{
      let httpRequest = self.returnNewIngredientHttpRequest();
      let resDatas = await httpRequest.getUnitOfMeasure();
      return resDatas;
    }catch(ex){
      console.error('getUnitOfMeasure - ex ',ex);
      return null;
    }
  },
  setUnitOfMeasure : function(props){
    window.staticType(props,[Object,null]);
    if(props == null){
      return;
    }
    console.log('vmadkfmvfv',props.return);
    this.set('measures_datas',props.return);
  },
  initSubmitValidation : function(form_rule,callback){
    let self = this;
		self.submitValidation({
			form_data : self.get('form_data'),
			form_rules : form_rule
		},function(res){
			let parent = $(self.find('form'));
			window.eachObject(res.error,function(i,key,val){
				switch(key){
					case 'ingredient_datas':
						console.log('val',val);
						var gg = parent.find('#ingredient_list').children('span.error').text(val);
						break;
					default:
					$.when(parent.find('input[name='+key+']')).done(function(rr){
						rr = rr.parents('.field').first();
						rr.find('span.error').text(val);
					});
					break;
				}
			})
			window.eachObject(res.form_data,function(i,key,val){
				switch(key){
					case 'ingredient_datas':
						parent.find('#ingredient_list').children('span.error').text('');
						break;
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
  handleClick : function(action,props,e){
    if(e != null)
      e.preventDefault();
    switch(action){
      case 'SUBMIT':
        this.submit();
        break;
      case 'BACK':
        window.history.back();
        break;
    }
  },
  submit : function(){
    let self = this;
    self.initSubmitValidation(self.get('form_rules'),async function(){
      try{
        let httpRequest = self.returnNewIngredientHttpRequest();
        let resData = await httpRequest.addIngredient(self.get('form_data'));
        console.log('resData - ',resData);
        swalSuccess('Success',gettext('Les données ont été enregistrées avec succès'))
        self.set('form_data',{});
        $(self.find('#form-create'))[0].reset();
      }catch(ex){
        console.error('submit - ex ',ex);
        swalFailure(gettext('Ups!, Quelque chose problème',ex.return));
      }
    })
  }
})

export default Layout({
  BodyContent : IngredientNew
})