import ListTable from '@app/v1/components/ListTable.js';
import template from './views/UsersView.html';
import UserHttpRequest from '../services/UserHttpRequest';
import Layout from '../Layout';
var BodyContent = ListTable.extend({
	template,
	isolate : true,
	data : function(){
		return {
			filter : {},
		}
	},
	onconfig : function(){
		let self = this;
		self._super();
		self.root.findComponent('head-menu').setHeader('page_name',gettext("Utilisateurs"));
	},
	oncomplete : function(){
		this._super();
	},
	returnUserHttpRequest : function(){
			return new UserHttpRequest();
	},
	getDatas : async function(){
		let self = this;
		try {
			let httpRequest = self.returnUserHttpRequest();
			let resData = await httpRequest.getUsers({});
			return resData;
		}catch(ex){
			console.error('getDatas -> ',ex);
		} 
	},
	setDatas : function(props){
		let self = this;
		if(props == null)
			return;
		self.set('datas',props.return);
	},
	handleClick : function(action,props,e){
		let self = this;
		switch(action){
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
	getStringStatus : function(statusCode){
		switch(parseInt(statusCode)){
			case 1:
			return gettext("Actif");
			case 2:
			return gettext("DÉSACTIVER");
			case 0:
			return gettext("EN ATTENTE");
		}
	},
	deleteItem : async function(id){
		let self = this;
		try{
			var url = window.HTTP_REQUEST.USER_XHR.DELETE;
			var formData = self.objectToFormData({
				ids : JSON.stringify([id])
			})
			var resData = await self.postData(url,formData);
			switch(resData.status){
				case 'error':
				break;
			}
			swalSuccess('Success',resData.return);
			let resdTa = await self.getDatas();
			self.setDatas(resdTa);
		}catch(ex){
			console.error('deleteItem -> ',ex);
		}
	},
	on : {
		observeFilterButtonClickListener : function(c,text,object){
			let self = this;
			switch(text){
				case 'ADD':
				return self.dispatch('/member/user/new',{ noHistory : false });
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

export default Layout({
	BodyContent : BodyContent
})