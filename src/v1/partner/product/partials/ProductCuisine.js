import template from './views/ProductCuisineView.html';
import ListTable from '@v1/components/ListTable';
import InputSearchDropdown from '@v1/components/input/InputSearchDropdown';
var ProductCuisine = ListTable.extend({
    template,
    isolate : true,
    components : {
      'input-search-dropdown' : InputSearchDropdown,
    },
    data : function(){
      return {
        filter : {},
        cuisines : [],
        submit : gettext("Ajouter"),
        form_data : {},
        form_rules : {
          cuisines_id : 'required'
        }
      }
    },
    onconfig : function(){
      let self = this;
      self._super();
      self.root.findComponent('head-menu').setHeader('page_name',gettext("Nom de la cuisine"));
      return new Promise(async (resolve)=>{
          let resData = await self.getCuisines();
          self.setCuisines(resData);
          resolve();
      })
    },
    initDOMSelection : function(whatCLass){
      let self = this;
      switch(whatCLass){
        case '.ui.dropdown':
        var dropdownCOnfig = {
          onChange : function(value,text,$selected){
            if(value == ""){
              return;
            }
            console.log('value',value);
            console.log('text',text);
            console.log('key',$($selected).attr('data-key'));
            let hidden = $($selected).parent();
            hidden = hidden.siblings('input[type=hidden]');
            let name = hidden.attr('name');
            let dataKey = $($selected).attr('data-key');
            let newData = {};
            newData[name] = value;
            self.setUpdate('form_data',{
              [[name]] : value
            });
          }
        }
        self.search_cuisine_dropdown = $(whatCLass).dropdown(dropdownCOnfig);
        break;
      }
    },
    getCuisines : async function(){
      let self = this;
      try{
        let url = window.HTTP_REQUEST.CUISINE_XHR.CUISINES;
        let resData = await self.getData(url,{});
        console.log('resData',resData);
        return resData;
      }catch(ex){
        console.error('getCuisines -> ',ex);
      }
    },
    setCuisines : async function(props){
      let self = this;
      switch(props.status){
        case 'error':
        return console.error('setCuisines -> ',props);
      }
      var users = props.return;
      let datas = [];
      await self.set('cuisines',props.return);
      self.initDOMSelection('.ui.dropdown');
    },
    getDatas : async function(){
      let self = this;
      try {
        let url = self.setUrl(window.HTTP_REQUEST.PRODUCT_XHR.PRODUCT_CUISINES,[{'{id}':self.root.get('id')}]);
        let resData = await self.getData(url,{});
        console.log('resData',resData);
        return resData;
      }catch(ex){
        console.error('getDatas -> ',ex);
      } 
    },
    setDatas : function(props){
      console.log('setDatas',props);
      let self = this;
      switch(props.status){
        case 'error':
        return console.error('setDatas - e ',props);
      }
      self.set('datas',props.return);
    },
    handleClick : function(action,props,e){
      let self = this;
      switch(action){
        case 'SUBMIT':
          e.preventDefault();
          self.submitData();
        break;
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
    submitData : function(){
      let self = this;
      let current_form_rules = self.get('form_rules');
      let formData = self.objectToFormData(self.get('form_data'));
      let url = self.setUrl(window.HTTP_REQUEST.PRODUCT_XHR.ADD_PRODUCT_CUISINE,[{"{id}":self.root.get('id')}]);
      self.initSubmitValidation(current_form_rules,function(){
        self.postData(url,formData).then(async function(res){
          console.log('res ->',res);
          switch(res.status){
            case 'success':
              swalSuccess('Success',gettext("Nouvelle cuisine créée!"));
              self.set('form_data',{});
              self.search_cuisine_dropdown.dropdown('clear');
              let resData = await self.getDatas();
              self.setDatas(resData);
              // Clear other semantic lib
              return;
            break;
          }
        })
      })
    },
    deleteItem : async function(id){
      let self = this;
      try{
        var url = self.setUrl(window.HTTP_REQUEST.PRODUCT_XHR.DELETE_PRODUCT_CUISINE,[{"{id}":self.root.get('id')}]);
        var formData = self.objectToFormData({
          ids : JSON.stringify([id])
        })
        var resData = await self.postData(url,formData);
        switch(resData.status){
          case 'error':
          break;
        }
        swalSuccess(gettext("Succès"),gettext("Supprimé"));
        let resdTa = await self.getDatas();
        console.log('vmdfkvmkfdvm',resdTa);
        self.setDatas(resdTa);
      }catch(ex){
        console.error('deleteItem -> ',ex);
      }
    },
    initSubmitValidation : function(form_rule,callback){
      let self = this;
      console.log('self',self.get('form_data'))
      let currentFormData = self.get('form_data');
      console.log('currentFormData',currentFormData);
      self.submitValidation({
        form_data : self.get('form_data'),
        form_rules : form_rule
      },function(res){
        console.log('res',res);
        let parent = $(self.find('form')).first();// $(self.find('#form-create'));
        console.log('parent',parent);
        for(var key in res.error){
          switch(key){
            default:
              setTimeout(function(key){
                var rr = parent.find('input[name='+key+']');
                rr = rr.parents('.field').first();
                rr.find('span.error').text(res.error[key]);
              }.bind(self,key),100)
            break;
          }
        }
        for(var key in res.form_data){
          switch(key){
            default:
              setTimeout(function(key){
                var rr = parent.find('input[name='+key+']');
                rr = rr.parents('.field').first();
                rr.find('span.error').text("");
              }.bind(self,key),100)
            break;
          }
        }
        if(res.status == 'complete'){   
          callback(res.form_data);
        }
      })
    },
    on : {
      observeFilterButtonClickListener : function(c,text,object){
        let self = this;
        switch(text){
          case 'ADD':
          return window.location.href = '';
        }
      }
    }
  })

  export default ProductCuisine;