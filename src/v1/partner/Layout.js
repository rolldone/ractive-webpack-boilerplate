
import template from './Layout.html';
import SideMenu from '@v1/components/SideMenu.js';
import RightMenuProperties from '@v1/components/RightMenuProperties.js';
import HeadMenu from '@v1/components/HeadMenu.js';
import BaseRactive from '../../lib/ractive/BaseRactive';

export default function(props){
	return BaseRactive.extend({
		template,
		components : {
			"side-menu" : props.SideMenu || SideMenu,
			'right-menu' : props.RightMenuProperties || RightMenuProperties,
			"head-menu" : props.HeadMenu || HeadMenu,
			"body-content" : props.BodyContent || null
		},
		onrender : function(){
			if( window.outerWidth < 1199 ){
				$('#wr-sidebar').removeClass('visible');
			} else {
				$('#wr-sidebar').addClass('visible');
			}
		},
	})
}