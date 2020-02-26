import template from './views/FilterBarView.html';
import BaseRactive from '@app/lib/ractive/BaseRactive';
let FilterBar = BaseRactive.extend({
    template,
    data : function(){
        return {
            add : '#',
            visibility : {
                add : 'show',
                delete : 'hide'
            }
        }
    },
    isolate : true,
    onconfig : function(){},
    onrender : function(){},
    oncomplete : function(){
        let self = this;
        $(self.find('input[type=text],input[type=number],input[type=email]')).on('keyup',function(e){
            if(self.pendingSearch!=null){
                self.pendingSearch.cancel();
            }
            self.pendingSearch = _.debounce(function(value,e){
                let action = $(e.target).attr('action');
                switch(action){
                    case null:
                    case undefined:
                    action = null;
                    return;
                }
                self.handleClick(action,{
                    value : value,
                },e);
            },500);
            self.pendingSearch(e.target.value,e)
        })
        $('#show-more').on('click', function(){
            $('.filter-menus').addClass("open").addClass("slideInRight").removeClass('slideInLeft');
        });
        $('#remove_open').on('click', function(){
            $('.filter-menus').removeClass('open').addClass('slideInLeft').removeClass('slideInRight');
        })
        $('.filter-menus .has_submenu').on('click', function(){
    let _this = $(this);
    let submenu = $(this).find('.submenu').css('display');

    if( submenu == 'none' ){
        _this.find('a .ion-ios-arrow-down').addClass('down');
    } else{
        _this.find('a .ion-ios-arrow-down').removeClass('down');
    }
    $(this).find('.submenu').slideToggle("fast");
    });
    },
    handleClick : function(action,props,e){
        switch(action){
            case 'ADD':
            break;
            case 'DELETE':
            break;
        }
        this.fire('filterButtonClickListener',action,props);
    },
    visibility : function(whatELement,action){
        self.set(whatELement,acton);
    }
})

export default FilterBar;