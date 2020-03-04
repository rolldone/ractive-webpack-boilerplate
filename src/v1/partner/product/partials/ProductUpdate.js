import ProductNew from "./ProductNew";
import config from '@config';

var ProductUpdate = ProductNew.extend({
	data : function(){
		return {
			submit : 'ENREGISTRER',
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
				window.eachObject(form_data,function(i,key,val){
					switch(key){
						case 'category':
							setTimeout(function(key){
								self[`ui_dropdown_select_${key}`].dropdown('set selected',form_data[key]+'').dropdown('refresh')
								callback(null)
							}.bind(self,key),1000)
							break;
						case 'nom':
							setTimeout(function(key){
								rootDom.find('input[name='+key+']').val(form_data[key]);
							}.bind(self,key),1000)
						break;
					}
				})
			},
			function(callback){
				try{
					window.eachObject(form_data,function(i,key,val){
						switch(key){
							case 'category':
							// Keep blank because is just had set on task before!!
							break;
							case 'conseils_de_preparation':
							case 'type':
							case 'contenance':
							case 'conditionnement':
								setTimeout(function(key){
									self[`ui_dropdown_select_${key}`].dropdown('refresh').dropdown('set selected',form_data[key]+'')
								}.bind(self,key),2000);
							break;
							case 'congelation':
							case 'consignes':
								if(form_data[key] == 1){
									setTimeout(function(key){
										self[`dom_${key}`].trigger('click');
									}.bind(self,key),2000)
								}
							break;
							case 'cuisine_id':
								if(self.dropdown_cuisine_id != null){
									return self.dropdown_cuisine_id.setValue(val+'');
								}
								break;
							case 'ingredients':
								var newIngredientDatas = [];
								for(var a=0;a<val.length;a++){
									newIngredientDatas.push({
										ingredient_id : val[a].pivot.ingredient_id,
										plats_id : val[a].pivot.plats_id,
										qty : val[a].pivot.qty,
										nom_de_ingredient : val[a].nom_de_ingredient,
										unite_de_mesure : val[a].unite_de_mesure
									})
								}
								self.set('ingredient_datas',newIngredientDatas);
								break;
							case 'photo':
								let photo = config.API_ASSET_URL+"/storage/plat/" + val;
								console.log("POTO ==> ", photo);
								rootDom.find(`#preview`).attr('src', photo);
							break;
							default:
								rootDom.find('input[name='+key+']').val(val);
							break;
						}
						if(i == Object.keys(form_data).length - 1){
							callback(null);
						}
					})
				}catch(ex){
					callback(null);
				}
			},
			function(callback){
				self.initTextvalidation();
				self.ingredientFormList = self.findComponent('ingredient-list');
				self.ingredientFormList.setDatas(self.get('ingredient_datas'));
				callback(null);
			}
		];
		await self.waitingTimeout(1000);
		asyncjs.series(task).then(function(res){
			console.log('res -> ',res);
		})
	},
	submitData : async function(){
		let self = this;
		self.setUpdate('form_data',{
			id : self.root.get('id')
		})
		await self.setUpdate('form_data',{
			ingredient_datas : self.get('ingredient_datas').length > 0 ? JSON.stringify(self.get('ingredient_datas')):null
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