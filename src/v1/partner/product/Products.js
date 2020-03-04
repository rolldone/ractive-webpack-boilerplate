import Layout from "../Layout";
import ListTable from "../../components/ListTable";
import FilterBar from "../../components/FilterBar";
import template from './views/ProductsView.html';

export const Products = ListTable.extend({
    template,
    isolate : true,
    data : function(){
      return {
        filter : {
          key : 'PLA'
        },
        query: {}
      }
    },
    components : {
			'filter-bar' : FilterBar
    },
    onconfig : function(){
    	let self = this;
			self._super();
			return new Promise(function(resolve){
				self.root.findComponent('head-menu').setHeader('page_name',gettext("Liste des plats"));
				resolve();
			})
    },
    onrender : function(){},
    oncomplete : function(){
			let self = this;
			self._super();
			return new Promise(async function(resolve){
				self.initPagination();
				self.setQuery();
				let resData = await self.getDatas();
				self.setDatas(resData); 
				self.initSelectionDOM('.sort-item');
				resolve();
			})
    },
    categoryGroup : function(array=[],key){
      if(array.length > 0){
        return array.includes(key);
      }
      return false;
    },
    initObServer : function(){
      let self = this;
      self.observe('update_state',function(val){
        if(self.pendingFetch != null){
          self.pendingFetch.cancel();
        }
        self.pendingFetch = _.debounce(async function(){
          if(val != null){
            self.setQuery();
            let resDatas = await self.getDatas(); 
            self.setDatas(resDatas);
          }
        },1000)
        self.pendingFetch();
      })
    },
    initSelectionDOM : function(action){
      let self = this;
      // self._super(action);
      let parent = $(self.find('table.ui.table'));
      switch(action){
        case '.sort-item':
          let sortItem = parent.find('.sort-item');
          let url,
              getParam;
          url = new URL(window.location.href);
          getParam = url.searchParams.get("orderBy");
          getParam == 'ASC' ? $(action).find('.ion-md-arrow-dropdown').addClass('up') : $(action).find('.ion-md-arrow-dropdown').removeClass('up');
          sortItem.on('click', function() {
            let _this = $(this);
            url = new URL(window.location.href);
            getParam = url.searchParams.get("orderBy");
            if(getParam == 'DESC'){
              _this.find('.ion-md-arrow-dropdown').addClass('up');
              self.handleClick('ORDER', {key: $(this).attr('data-key'), orderBy: 'ASC'});
            } else{
              _this.find('.ion-md-arrow-dropdown').removeClass('up');
              self.handleClick('ORDER', {key: $(this).attr('data-key'), orderBy: 'DESC'});
            }
          });
        break;
        case 'list-menu-click':
        $('.list-menu-click')
          .popup({
            inline     : true,
            on    : 'click',
            
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
    initPagination : async function(){
      let self = this;
      let parseJSON = self.jsonParseUrl(window.location.url);
      await self.set('take',parseJSON.query.take);
      await self.set('page',parseJSON.query.page);
      self.getPaginationNumbers(self.get('take'),self.get('page'),true).then(async function(){
        $("#pag-data").find('.item.active').removeClass('active')
        await self.waitingTimeout(1000);
        $("#pag-data").find('[data-value='+self.get('page')+']').addClass('active');
      });
    },
    getDatas : async function(){
      let self = this;
      try {
        let url = window.HTTP_REQUEST.PRODUCT_XHR.PRODUCTS;
        let query = self.get('query');
        
        if(query.query !== undefined){
          let resData = await self.getData(url,query.query);
          return resData;
        }
        
        let resData = await self.getData(url,{});
        return resData;
      }catch(ex){
        console.error('getDatas -> ',ex);
      } 
    },
    setDatas : async function(props){
      let self = this;
      switch(props.status){
        case 'error':
        return;
      }
      if(props.last_page > 0){
        await self.recheckPaginationAfterEmpty(props.last_page);
      }
      self.set('datas',props.return).then(function(){
        self.initSelectionDOM('list-menu-click');
      });
    },  
    handleClick : function(action,props,e){
      let self = this;
      switch(action){
        case 'ORDER':
          let urlQuery = self.jsonToQueryUrl(window.location.href , props);
          self.updateUrlState(urlQuery, 'PUSH_STATE');
          self.set('update_state', (new Date()).getMilliseconds());
        break;
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
    setQuery: function(){
			let self = this;
      let parseQuery = self.jsonParseUrl(window.location.href);
      self.set('query', parseQuery);
    },
    deleteItem : async function(id){
      let self = this;
      try{
        var url = window.HTTP_REQUEST.PRODUCT_XHR.DELETE;
        var formData = self.objectToFormData({
          ids : JSON.stringify([id])
        })
        var resData = await self.postData(url,formData);
        switch(resData.status){
          case 'error':
          break;
        }
        swalSuccess(gettext("Suppression du plat réalisée"),resData.return);
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
          return self.dispatch('product.new',{ noHistory : false });
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
		BodyContent : Products
	})