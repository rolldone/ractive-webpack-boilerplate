import Layout from "../Layout";
import { IngredientNew } from "./IngredientNew";
import HistoryStock from './partials/HistoryStock';

export const IngredientUpdate = IngredientNew.extend({
  components : {
    "ingredient-stock" : HistoryStock
  },
  data : {
    tabs : [{
      key : 'FORM',
      label : gettext("Créer un nouvel ingrédient alimentaire")
    },{
      key : 'INGREDIENT_STOCK',
      label : gettext('Historique des données boursières')
    }],
    submit : gettext('Mettre à jour')
  },
  oncomplete : function(){
    let self = this;
    self._super();
    return new Promise(async (resolve)=>{
      self.setData(await self.getData());
      resolve();
    })
  },
  getData : async function(){
    try{
      let httpRequest = this.returnNewIngredientHttpRequest();
      let resData = await httpRequest.getIngredient(this.root.get('id'));
      return resData;
    }catch(ex){
      console.error('getData - ex ',ex);
      return null;
    }
  },
  setData : function(props){
    let self = this;
    window.staticType(props,[Object,null]);
    this.set('form_data',props.return);
    let parent = $(self.find('#form-create'));
    window.eachObject(self.get('form_data'),function(i,key,val){
      switch(key){
        case 'unite_de_mesure':
          self.measure_dropdown.setValue(val+'');
        default:
          parent.find(`input[name=${key}]`).val(val);
          break;
      }
    })
  },
  submit : function(){
    let self = this;
    self.initSubmitValidation(self.get('form_rules'),async function(){
      try{
        let httpRequest = self.returnNewIngredientHttpRequest();
        let resData = await httpRequest.updateIngredient(self.get('form_data'));
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
  BodyContent : IngredientUpdate
})