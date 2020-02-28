import Layout from "../Layout";
import template from './views/MenuTabNewView.html';
import TabHead from "../../components/tab/TabHead";
import TabPage from "../../components/tab/TabPage";
import BaseRactive from 'BaseRactive';
import MenuNew from "./partials/MenuNew";

export const MenuTabNew = BaseRactive.extend({
	template,
	components : {
		"tab-head" : TabHead,
		"tab-page" : TabPage,
		"menu-form" : MenuNew
	},
	data : function(){
		return {
			tabs : [{
				key : 'FORM',
				label : gettext("Créer une nouvelle menu")
			}],
		}
	},
	onconfig : function(){
			let self = this;
			self._super();
			self.root.findComponent('head-menu').setHeader('page_name',gettext("Créer un nouvel menu"));
	},
})

export default Layout({
	BodyContent : MenuTabNew
})