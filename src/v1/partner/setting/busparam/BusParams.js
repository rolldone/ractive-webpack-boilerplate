import BaseRactive from 'BaseRactive';
import Layout from '../../Layout';
import template from './views/BusParamsView.html';
import FilterBar from '@v1/components/FilterBar';

export const BusParams = BaseRactive.extend({
  template,
  isolate : true,
  components : {
    'filter-bar' : FilterBar
  },
  data : function(){
    return {
      datas : []
    }
  },
  onconfig : function(){
    let self = this;
    self._super();
    self.root.findComponent('head-menu').setHeader('page_name',gettext("Catégories"));
  },
  oncomplete : async function(){
    let self = this;
    let resData = await self.getBusParamCats();
    self.setBusParamCats(resData);
  },
  initSelectionDOM : function(action){
    let self = this;
    switch(action){
      case 'list-menu-click':
      $('.list-menu-click')
        .popup({
          inline     : true,
          on    : 'click',
          position   : 'bottom right',
          delay: {
            show: 300,
            hide: 800
          }
        }) 
      break;
      case 'multi_choice':
        $('.multi_choice').off();
        $('.multi_choice').on('change',function(e){
          var theSelectedData = self.get('data_selected');
          theSelectedData = self.initSelectedData($(e.target).attr('data-id'),theSelectedData);
          console.log('theSelectedData -> ',theSelectedData);
          self.set('data_selected',theSelectedData).then(function(){
            console.log('data_selected -> ',self.get('data_selected'));
            if(theSelectedData.length > 0){
              self.findComponent('right-btn').show();
            }else{
              self.findComponent('right-btn').hide();
            }
          });
        })
      return;
      case 'right_menu':
      self.rightMenu = self.root.findComponent('right-menu');
      self.rightMenu.setOnClickListener = function(props){
        switch(props.action){
          case 'DELETED':
            self.deleteItems();
          break;
          case 'UNSELECTED':
            $('.multi_choice').prop('checked',false);
            self.set('data_selected',[]);
            self.findComponent('right-btn').hide();
          break;
        }
      };
      return;
      default:
      return alert(action+' Is Not Defined!');
    }
  },
  getBusParamCats : async function(){
    let self = this;
    try {
      let url = window.HTTP_REQUEST.BUS_PARAM_XHR.BUS_PARAMS;
      let resData = await self.getData(url,{});
      return resData;
    }catch(ex){
      console.error('getBusParamCats -> ',ex);
    } 
  },
  setBusParamCats : function(props){
    let self = this;
    switch(props.status){
      case 'error':
      return;
    }
    self.set('datas',props.return).then(function(){
      self.initSelectionDOM('list-menu-click');
    });
  },  
  handleClick : function(action,props,e){
    let self = this;
    switch(action){
      case 'DELETE_ITEM':
        self.deleteItem(props.id);
      break;
    }
  },
  deleteItem : async function(id){
    let self = this;
    try{
      var url = window.HTTP_REQUEST.BUS_PARAM_XHR.DELETE;
      var formData = self.objectToFormData({
        ids : JSON.stringify([id])
      })
      var resData = await self.postData(url,formData);
      switch(resData.status){
        case 'error':
        break;
      }
      swalSuccess(gettext('Suppression des paramêtres réalisée'),resData.return);
      self.oncomplete();
    }catch(ex){
      console.error('deleteItem -> ',ex);
    }
  },
  newOn : {
    observeFilterButtonClickListener : function(c,text,object){
      let self = this;
      switch(text){
        case 'ADD':
        return self.dispatch('setting.bus_param.new')
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
          // {
          //   label : 'Reset',
          //   href : '',
          //   action : 'RESET'
          // },
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
  BodyContent : BusParams
})