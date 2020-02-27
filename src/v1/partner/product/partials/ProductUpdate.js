import ProductNew from "./ProductNew";
import config from '@config';

var ProductUpdate = ProductNew.extend({
	data : function(){
		return {
			submit : 'ENREGISTRER',
			tabs : [{
				key : 'FORM',
				label : gettext("Créer une nouvelle cuisine")
			},{
				key : 'CUISINE_USER',
				label : 'Cuisine Users'
			}],
		}
	},
	onconfig : function(){
		let self = this;
		self._super();
		this.root.findComponent('head-menu').setHeader('page_name',gettext("Mettre à jour un plat"));
	},
	oncomplete : function(){
		let self = this;
		this._super();
		return new Promise(async function(resolve){
			let resData = await self.getItem();
			self.setItem(resData);
		})
		// self.initTextvalidation();
	},
	getItem : async function(){
		let self = this;
		try{
			let url = self.setUrl(window.HTTP_REQUEST.PRODUCT_XHR.VIEW,[{'{id}':self.root.get('id')}]);
			let resData = await self.getData(url,{});
			return resData;
		}catch(ex){
			console.error('getItem -> ',ex);
		}
	},
	setItem : async function(props){
		let self = this;
		switch(props.status){
			case 'error':
			return;
		}
		let currentProps = props.return;
		await self.set('form_data',currentProps);
		let form_data = self.get('form_data');
		try{
			var rootDom = $(self.find('#form-create'));
		}catch(ex){
			console.error('setItem',ex);
		}
		console.log('async',props);
		var task = [
			function(callback){
				for(var key in form_data){
					switch(key){
						case 'category':
							var fixKey = key;
							setTimeout(function(key){
								self[`ui_dropdown_select_${key}`].dropdown('set selected',form_data[key]+'').dropdown('refresh')
								callback(null,'vmdfkmkdfvm')
							}.bind(self,fixKey),1000)
							break;
						case 'nom':
							var fixKey = key;
							setTimeout(function(key){
								rootDom.find('input[name='+key+']').val(form_data[key]);
							}.bind(self,fixKey),1000)
						break;
					}
				}
			},
			function(callback){
				try{
					for(var key in form_data){
						switch(key){
							case 'category':
							// Keep blank because is just had set on task before!!
							break;
							case 'conseils_de_preparation':
							case 'type':
							case 'contenance':
							case 'conditionnement':
								var fixKey = key;
								setTimeout(function(key){
									self[`ui_dropdown_select_${key}`].dropdown('refresh').dropdown('set selected',form_data[key]+'')
								}.bind(self,fixKey),2000);
							break;
							case 'congelation':
							case 'consignes':
								var fixKey = key;
								if(form_data[fixKey] == 1){
									setTimeout(function(key){
										self[`dom_${key}`].trigger('click');
									}.bind(self,fixKey),2000)
								}
							break;
							case 'photo':
								setTimeout(function(key){
									let photo = config.API_ASSET_URL+"/storage/plat/" + form_data[key];
									console.log("POTO ==> ", photo);
									rootDom.find(`#preview`).attr('src', photo);
								}.bind(self,key),100);
							break;
							default:
								var fixKey = key;
								rootDom.find('input[name='+fixKey+']').val(form_data[fixKey]);
							break;
						}
					}  
					callback(null);
				}catch(ex){
					callback(null);
				}
			},
			function(callback){
				self.initTextvalidation();
				callback(null);
			}
		];
		await self.waitingTimeout(1000);
		asyncjs.series(task).then(function(res){
			console.log('res -> ',res);
		})
	},
	submitData : function(){
		let self = this;
		self.setUpdate('form_data',{
			id : self.root.get('id')
		})
		console.log('form_data',self.get('form_data'));
		let formData = self.objectToFormData(self.get('form_data'));
		let url = window.HTTP_REQUEST.PRODUCT_XHR.UPDATE;
		let current_form_rules = self.get('form_rules');
		self.initSubmitValidation(current_form_rules,function(){
			self.postData(url,formData).then(function(res){
				console.log('res ->',res);
				switch(res.status){
					case 'success':
						swalSuccess(gettext("Édition du plat réalisée"));
						return;
					break;
				}
			})
		})
	},
	on : {
		setting_key : function(event){
			alert(setting_key);
		}
	}
})

export default ProductUpdate;