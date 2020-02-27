import Listtable from '@v1/components/ListTable.js';
import Layout from '../Layout.js';
import template from './views/CuisinesView.html';
import CuisinesHttpRequest from '../services/CuisinesHttpRequest.js';

export const Cuisines = Listtable.extend({
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
    returnCuisinesHttpRequest : function(){
      return new CuisinesHttpRequest();
    },
    getDatas : async function(){
      let self = this;
      try {
        let url = window.HTTP_REQUEST.CUISINE_XHR.CUISINES;
        let resData = await self.getData(url,{});
        return resData;
      }catch(ex){
        console.error('getDatas -> ',ex);
      } 
    },
    setDatas : function(props){
      let self = this;
      switch(props.status){
        case 'error':
        return console.error('setDatas - e ',props);
      }
      self.set('datas',props.return);
    },
    handleClick : function(action,props,e){
      let self = this;
      switch(action){
        case 'DELETE@global.gettextTEM':
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
        let httpRequest = self.returnCuisinesHttpRequest();
        let resData = await httpRequest.deleteCuisine([id]);
        swalSuccess(gettext('Suppression de la cuisine réalisée'));
        let resdTa = await self.getDatas();
        self.setDatas(resdTa);
      }catch(ex){
        console.error('deleteItem -> ',ex);
      }
    },
    on : {
      observeFilterButtonClickListener : function(c,text,object){
        let self = this;
        switch(text){
          case 'ADD':
          return this.root.router.dispatch('/member/cuisine/new',{ noHistory : false });
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
    BodyContent : Cuisines
})