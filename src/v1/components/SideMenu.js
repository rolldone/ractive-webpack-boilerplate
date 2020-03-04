import template from './views/SideMenuView.html';
import BaseRactive from '../../lib/ractive/BaseRactive';

let SideMenu = BaseRactive.extend({
  template,
  isolate : true,
  oncomplete : function(){
    var segments = window.location.pathname.split( '/' );
    console.log(segments);
    let listUrl = $('.base_list.menu').find('a');
    let isIndex = true;
    listUrl.each(function(index,dom){
      console.log(index,segments[segments.length - 1]);
      switch(segments[segments.length - 1]){
        case undefined:
        case "":
          $(dom).parent().addClass('active');
          isIndex = false;
        return false;
        default:
          if($(dom).attr('href').includes(segments[segments.length - 1]) ){
            // $(dom).parent().addClass('active');
            // $(dom).parent().closest('.submenu').css('display', 'block').siblings('.has_submenu').find('.icon.angle').addClass('down');
            isIndex = false;
          } 
        break;
      }
    })
    if(isIndex){
      // $(listUrl[0]).parent().addClass('active');
    }
    $('.ui.dropdown').dropdown();
    $('.has_submenu').on('click', function(){
      let _this = $(this);
      let submenu = $(this).siblings('.submenu').css('display');

      _this.closest('li').siblings().find('.submenu').slideUp('slow').siblings().find('.icon.angle').removeClass('down');

      if( submenu == 'none' ){
        _this.find('.icon.angle').addClass('down');
      } else{
        _this.find('.icon.angle').removeClass('down');
      }
      $(this).siblings('.submenu').slideToggle("slow");
    });
  }
})

export default SideMenu;