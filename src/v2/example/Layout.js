import BaseRactive from "../../lib/ractive/BaseRactive";
import template from './Layout.html';
import SideMenu from '@v2/components/SideMenu.js';
import RightMenuProperties from '@v2/components/RightMenu.js';
import HeadMenu from '@v2/components/HeadMenu.js';

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