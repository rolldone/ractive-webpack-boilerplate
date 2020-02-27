import template from './views/HeadMenuView.html';
import BaseRactive from '../../lib/ractive/BaseRactive';

export default BaseRactive.extend({
	template,
	isolate : true,
	data : function(){
		return {
			page_name : gettext("Créer un nouvel utilisateur")
		}
	},
	onconfig : function(){

	},
	onrender : function(){

	},
	handleClick : function(action,props,e){
		switch(action){
			case 'OPEN_SIDE_MENU':
				$('#wr-sidebar').sidebar('toggle')
			break;
			case 'RIGHT_USER_MENU':
				$('#right-head-pop-menu')
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
		}
	},
	setHeader : function(whatData,value){
		this.set(whatData,value);
	}
})