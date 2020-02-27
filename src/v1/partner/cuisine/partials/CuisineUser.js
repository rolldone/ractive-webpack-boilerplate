import ListTable from '@v1/components/ListTable.js';
import CuisinesHttpRequest from '../../services/CuisinesHttpRequest';
import UserHttpRequest from '../../services/UserHttpRequest';
import template from './views/CuisineUserView.html';
import InputSearchDropdown from '@v1/components/input/InputSearchDropdown.js';

export default ListTable.extend({
    template,
    isolate : true,
    components : {
      'input-search-dropdown' : InputSearchDropdown
    },
    data : function(){
      return {
        filter : {},
        users : [],
        submit : gettext("Ajouter"),
        form_data : {},
        form_rules : {
          user_id : 'required'
        }
      }
    },
    returnCuisinesHttpRequest : function(){
      return new CuisinesHttpRequest();
    },
    returnUserHttpRequest : function(){
      return new UserHttpRequest();
    },
    onconfig : function(){
      let self = this;
      self._super();
      return new Promise(async function(resolve){
          self.root.findComponent('head-menu').setHeader('page_name',gettext("Nom de la cuisine"));
          let resData = await self.getUsers();
          self.setUsers(resData);
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
        self.search_user_dropdown = $(whatCLass).dropdown(dropdownCOnfig);
        break;
      }
    },
    getUsers : async function(){
      let self = this;
      try{
        let httpRequest = self.returnUserHttpRequest();
        let resData = await httpRequest.getUsers({});
        if(resData.status == "error")
          throw resData.data.responseJSON;
        return resData;
      }catch(ex){
        console.error('getUsers -> ',ex);
      }
    },
    setUsers : async function(props=null){
      if(props == null)
        return;
      let self = this;
      var users = props.return;
      let datas = [];
      for(var a=0;a<users.length;a++){
        console.log('nom',users[a].prenom);
        datas.push({
          id : users[a].id,
          name : `${users[a].nom} ${users[a].prenom} - ${users[a].email}`,
        })
      }
      await self.set('users',datas);
      self.initDOMSelection('.ui.dropdown');
    },
    getDatas : async function(){
      let self = this;
      try {
        let httpRequest = self.returnCuisinesHttpRequest();
        let resData = await httpRequest.getCuisineUsers(self.root.get('id'));
        console.log('resData',resData);
        if(resData.status == "error"){
          throw resData.data.responseJSON;
        }
        return resData;
      }catch(ex){
        console.error('getDatas -> ',ex);
      } 
    },
    setDatas : function(props){
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
        case 'DELETE':
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
      let url = self.setUrl(window.HTTP_REQUEST.CUISINE_XHR.ADD_CUISINE_USER,[{"{id}":self.root.get('id')}]);
      self.initSubmitValidation(current_form_rules,function(){
        self.postData(url,formData).then(async function(res){
          switch(res.status){
            case 'error':
              res = res.data.responseJSON;
              swalFailure(gettext("Échec de l'ajout de données"),res.return.message);
            break;
            case 'success':
              swalSuccess('Success',gettext('Nouvelle cuisine créée!'));
              self.set('form_data',{});
              self.search_user_dropdown.dropdown('clear');
              let resData = await self.getDatas();
              self.setDatas(resData);
              /*Clear other semantic lib*/
              return;
            break;
          }
        })
      })
    },
    deleteItem : async function(id){
      let self = this;
      try{
        let httpRequest = self.returnCuisinesHttpRequest();
        let resData = await httpRequest.deleteCuisineUsers({
          id : self.root.get('id'),
          ids : [id]
        })
        if(resData.status == "error")
          throw resData.data.responseJSON;
        swalSuccess(gettext("Succès"),gettext("Supprimé"));
        let resdTa = await self.getDatas();
        self.setDatas(resdTa);
      }catch(ex){
        swalFailure(gettext("La suppression de l'utilisateur a échoué"),ex.return.message);
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
        let parent = $(self.find('form')).first();
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