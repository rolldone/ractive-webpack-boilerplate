import template from './views/RightMenuPropertiesView.html';
import BaseRactive from '../../lib/ractive/BaseRactive';

export default BaseRactive.extend({
    template,
    isolate : true,
    data : function(){
    	return {
    		menuItem : []
    	}
    },
    onconfig : function(){},
    onrender : function(){},
    oncomplete : function(){
    	let self = this;
    },
    handleClick : function(action,props,e){
    	let self = this;
			switch(action){
				case 'MENU_ITEM_CLICK':
          if(self.setOnClickListener == null){
            return;
          }
          self.setOnClickListener(props);
          self.hide();
				break;
				case 'SHOW_RIGHT_MENU':
					self.set('menuItem',props).then(function(){
						$('#right-menu-properties')
  						.sidebar('toggle');
					});
				break;
				case 'HIDE_RIGHT_MENU':
          $('#right-menu-properties')
            .sidebar('toggle');
          setTimeout(function(){
            self.set('menuItem',[]).then(function(){});
          },1000);
					
				break;
			}
    },
    show : function(props){
    	/** Show Right Menu **/
    	let self = this;
    	self.initObserve();
      console.log('show -> ',props);
			self.handleClick('SHOW_RIGHT_MENU',props);
    },
    hide : function(){
    	/** Hide Right Menu **/
			this.handleClick('HIDE_RIGHT_MENU',{});
    },
    initializeLogicMenu : function(){
    	let self = this;
    	var segments = window.location.pathname.split( '/' );
      console.log(segments);
      let listUrl = $('#right-menu-properties').find('a');
      let isIndex = true;
      listUrl.each(function(index,dom){
        console.log(index,segments[3]);
        switch(segments[3]){
          case undefined:
          case "":
            $(dom).parent().addClass('active');
            isIndex = false;
          return false;
          default:
            // if($(dom).attr('href').includes(segments[3])){
            //   $(dom).parent().addClass('active');
            //   isIndex = false;
            // } 
          break;
       }
      })
      if(isIndex){
        // $(listUrl[0]).parent().addClass('active');
      }
    },
    initObserve : function(){
    	let self = this;
    	/** Listen update data state change **/
      self.watchPage = this.observe('menuItem',function(newValue,oldValue,keyPath){
        if(oldValue != null){
        	self.initializeLogicMenu();
        }        
      })
    }
  })