import BaseRactive from 'BaseRactive';
import TabHead from '@v1/components/tab/TabHead';
import TabPage from '@v1/components/tab/TabPage';
import ProductNew from './partials/ProductNew';
import Layout from '../Layout';
import template from './views/ProductTabNewView.html';

export const ProductTabNew = BaseRactive.extend({
	template,
	components : {
		"tab-head" : TabHead,
		"tab-page" : TabPage,
		"product-new" : ProductNew,
	},
	data : function(){
		return {
			tabs : [{
				key : 'FORM',
				label : gettext("Créer une nouvelle plat")
			}],
			form_rules : {
				nom : 'required',
				category : 'required',
			},
			form_type_select : '',
			categories : {},
		}
	},
	isolate : true,
	onconfig : function(){
		let self = this;
		self._super();
		self.root.findComponent('head-menu').setHeader('page_name',gettext("Ajouter un nouveau produit"));
	}
})

export default Layout({
	BodyContent : ProductTabNew
})