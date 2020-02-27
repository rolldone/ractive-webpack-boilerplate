import FilterBar from './FilterBar';
import template from './views/ListTableView.html';
import BaseRactive from 'BaseRactive';

var ListTable = BaseRactive.extend({
    template,
    isolate : true,
    data : function(){
        return {
        datas : []
        }
    },
    components : {
            'filter-bar' : FilterBar
    },
    onconfig : function(){
        let self = this;
        self._super();
        self.root.findComponent('head-menu').setHeader('page_name','{{_i("Base List Table")}}');
    },
    onrender : function(){},
    oncomplete : async function(){
        let self = this;
        self.initPagination();
        let resData = await self.getDatas();
        self.setDatas(resData); 
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
            let resDatas = await self.getDatas(); 
            self.setDatas(resDatas);
            }
        },1000)
        self.pendingFetch();
        })
    },
    initSelectionDOM : function(action){
        let self = this;
        let parent = $(self.find('table.ui.table'));
        alert(action);
        switch(action){
        case '.sort-item':
        let sortItem = parent.find('.sort-item');
        sortItem.on('click', function() {
            let _this = $(this);
            console.log('this ==> ', $(this));
            let downArrow = _this.find('.icon').hasClass('down');
            if(downArrow == true){
            _this.find('.icon').removeClass('down').addClass('up')
            } else{
            _this.find('.icon').removeClass('up').addClass('down')
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
                // swalConfirm({
                //   text : 'vmadfvmkv',
                //   type : 'warning',
                //   confirmButtonText : 'Yes Delete it',
                // },function(result){
                //   console.log(result);
                // });
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
		console.log('parseJSON',parseJSON);
        await self.set('take',parseJSON.query.take);
		await self.set('page',parseJSON.query.page);
        self.getPaginationNumbers(self.get('take'),self.get('page'),true).then(async function(){
			$("#pag-data").find('.item.active').removeClass('active')
			await self.waitingTimeout(1000);
			$("#pag-data").find('[data-value='+self.get('page')+']').addClass('active');
        });
    },  
    handleClick : function(action,props,e){
        let self = this;
        switch(action){
        case 'NEW_PAGE_DATA':
        return window.location.href = '';
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
        alert('DeleteItem Example - '+id);
    },
    on : {
        observeFilterButtonClickListener : function(c,text,object){
        let self = this;
        switch(text){
            case 'ADD':
            return self.handleClick('NEW_PAGE_DATA',{},null);
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

export default ListTable;