import FormList from '@v1/components/FormList';
import template from './views/IngredientFormListView.html';

export default FormList.extend({
    template,
    returnNewIngredientHttpRequest : function(){
      return new IngredientHttpRequest();
    },
    handleClick : async function(action,props,e){
      let self = this;
      switch(action){
        case 'DELETE':
          var datas = self.get('datas');
          datas.splice(props.index,1);
          self.set('datas',datas);
          self.onFormListListener(action,self.get('datas'),e);
        break;
        case 'UPDATE':
          self.onFormListListener(action,self.get('datas')[props.index],e);
        break;
      }
    },
    deleteIngredient : async function(id){
      window.staticType(id,[Number,String]);
      try{
        let self = this;
        let httpRequest = self.returnNewIngredientHttpRequest();
        let resData = await httpRequest.deletePlatsIngredient(id);
        $.notify(`${$resData.return}{{_i("Supprimé")}}`, "success");
      }catch(ex){
        console.error('deleteIngredient - ex ',ex);
      }
    }
  })