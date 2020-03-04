import ListTable from '@v1/components/ListTable';
import template from './views/CuisinersView.html';
import CuisinerHttpRequest from '../services/CuisinerHttpRequest';
import Layout from '../Layout';

export const Cuisiners = ListTable.extend({
  template,
  isolate : true,
  data : function(){
    return {
      filter : {}
    }
  },
  onconfig : function(){
    let self = this;
    self._super();
    self.root.findComponent('head-menu').setHeader('page_name',gettext("Liste des cuisines"));
  },
  getDatas : async function(){
    let self = this;
    try{
      var httpRequest = new CuisinerHttpRequest();
      var resDatas = await httpRequest.getCuisiners({});
      if(resDatas.status == "error"){
        throw resDatas;
      }
      return resDatas;
    }catch(ex){
      console.error('getDatas - ex ',ex);
    }
  },
  setDatas : function(props){
    let self = this;
    self.set('datas',props.return);
  },
  handleClick : function(action,props,e){
    let self = this;
    switch(action){
      case 'DELETE_ITEM':
        self.deleteItem(props.id);
      break;
      case 'PAGINATION':
        $(e.target).parent().find('.active').removeClass('active');
        let newPage = props.page;
        switch(true){
          case props.is_first == true:
          case props.is_last == true:
          return self.getPaginationNumbers(self.get('take'),newPage,true).then(function(){
            $("#pag-data").find('[data-value='+self.get('page')+']').addClass('active');
            self.set('update_state',new Date())
          });
        }
        self.getPaginationNumbers(self.get('take'),newPage,false).then(function(){});
        $("#pag-data").find('[data-value='+self.get('page')+']').addClass('active');
        self.set('update_state',new Date())
      break;
    }
  },
  deleteItem : async function(id){
    let self = this;
    try{
      var httpRequest = new CuisinerHttpRequest();
      let resDelete = await httpRequest.deleteCuisiner([id]);
      if(resDelete.status == "error"){
        throw resDelete;
      }
      swalSuccess(gettext("Suppression de la cuisine réalisée"));
      let resdTa = await self.getDatas();
      self.setDatas(resdTa);
    }catch(ex){
      console.error('deleteItem -> ',ex);
    }
  },
  newOn : {
    observeFilterButtonClickListener : function(c,text,object){
      let self = this;
      switch(text){
        case 'ADD':
        return self.dispatch('cuisiner.new')
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
          /*{
            label : 'Reset',
            href : '',
            action : 'RESET'
          },*/
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
  BodyContent : Cuisiners
})