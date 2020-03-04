import Layout from "../Layout";
import template from './views/IngredientListView.html';
import ListTable from "../../components/ListTable";
import IngredientHttpRequest from "../services/IngredientHttpRequest";

export const IngredientList = ListTable.extend({
  template,
  returnNewIngredientHttpRequest : function(){
    return new IngredientHttpRequest();
  },
  getDatas : async function(){
    try{
      let httpRequest = this.returnNewIngredientHttpRequest();
      let resData = await httpRequest.getIngredients({});
      return resData;
    }catch(ex){
      console.error('getDatas - ex ',ex);
      return null;
    }
  },
  setDatas : function(props){
    window.staticType(props,[Object,null]);
    if(props == null){
      return;
    }
    this.set('datas',props.return);
  },
  newOn : {
    observeFilterButtonClickListener : function(c,text,object){
      let self = this;
      switch(text){
        case 'ADD':
        return self.dispatch('ingredient.new',{ noHistory : false });
        case 'SEARCH':
          self.setUpdate('filter',{
            search : object.value
          })
          setTimeout(function(){
            self.set('update_state',new Date())
          },1000);
        return;
        case 'RIGHT_BTN_CLICK':
        return self.rightMenu.show([
          {
            label : 'Deleted',
            href : '',
            action : 'DELETED'
          },
          {
            label : 'Unselected',
            href : '',
            action : 'UNSELECTED'
          }
        ]);
      }
    }
  }
})

export default Layout({
  BodyContent : IngredientList
})