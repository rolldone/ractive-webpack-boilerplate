import Layout from "../Layout";
import { Products } from "./Products";
import SelfPlatsHttpRequest from "../services/SelfPlatsHttpRequest";

export const ProductsSelf = Products.extend({
	data : function(){
		return {
			filter : {
				key : 'PLA'
			}
		}
	},
	getDatas : async function(){
		try {
			let platsHttp = new SelfPlatsHttpRequest();
			let resData = await platsHttp.getPlats({});
			return resData;
		}catch(ex){
			console.error('getDatas -> ',ex);
		} 
	},  
	deleteItem : async function(id){
		window.staticType(id,[Number]);
		let self = this;
		try{
			let platsHttp = new SelfPlatsHttpRequest();
			let resData = await platsHttp.deleteSelfPlats([id]);
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
	on : {
		observeFilterButtonClickListener : function(c,text,object){
			let self = this;
			switch(text){
				case 'ADD':
				self.dispatch('product.new');
				return;
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
	BodyContent : ProductsSelf
})