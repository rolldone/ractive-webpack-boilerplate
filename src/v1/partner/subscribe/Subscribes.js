import Layout from "../Layout";
import ListTable from '@v1/components/ListTable';
import template from './views/SubscribesView.html';
import SubscribeHttpRequest from "../services/SubscribeHttpRequest";

export const Subscribes = ListTable.extend({
  template,
  onconfig : function(){
    let self = this;
    self._super();
    self.root.findComponent("head-menu").setHeader("page_name", gettext("Souscrire"));
  },
  oncomplete : function(){
    let self = this;
    self._super();
  },
  returnSubscribeHttpRequest : function(){
    return new SubscribeHttpRequest();
  },
  getDatas : async function(){
    let self = this;
    try{
      let httpRequest = self.returnSubscribeHttpRequest();
      let resdata = await httpRequest.getSubscribes({});
      return resdata;
    }catch(ex){
      console.error('getDatas - ex ',ex);
      return null;
    }
  },
  setDatas : function(props){
    let self = this;
    if(props == null)
      return;
    self.set('datas',props.return);
  },
  deleteData : async function(id){
    window.staticType(id,[Number,String]);
    let self = this;
    try{
      let httpRequest = self.returnSubscribeHttpRequest();
      let resdata = await httpRequest.deleteSubscribe([id]);
      swalSuccess(gettext("Effacer les données avec succès"),'',function(){
        self.oncomplete();
      })
    }catch(ex){
      console.error('deleteData - ex ',ex);
      swalFailure(gettext("Échec de l'effacement des données"),ex.return.message,function(){});
    }
  },
  handleClick : function(action,props,e){
    if(e!=null)
      e.preventDefault();
    let self = this;
    switch(action){
      case 'NEW_PAGE_DATA':
      return;
      case 'DELETE_ITEM':
        self.deleteData(props.id);
      break;
    }
  }
})

export default Layout({
  BodyContent : Subscribes
})