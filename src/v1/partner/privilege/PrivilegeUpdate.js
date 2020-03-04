import { PrivilegeNew } from "./PrivilegeNew";
import Layout from "../Layout";
import PrivilegeHttpRequest from "../services/PrivilegeHttpRequest";

export const PrivilegeUpdate = PrivilegeNew.extend({
  onconfig : function(){
    let self = this;
    self._super();
    self.root.findComponent('head-menu').setHeader('page_name',gettext("Mettre à jour un niveau d'accès"));  
  },
  oncomplete : async function(){
    let self = this;
    await self.setBelowGroupId(await self.getBelowGroupId());
    self.initSelectionDOM('.ui.checkbox');
    self.initSelectionDOM('.ui.dropdown');
    self.initTextvalidation();
    let resData = await self.getPrivilegeItem();
    self.setPrivilegeItem(resData);
    self.setPrivilegeData(await self.getPrivilegeData());
  },
  submitData : async function(){
    let self = this;
    let current_form_rules = self.get('form_rules');
    // Get Privilege Items
    let resKeyChoose = await self.eachPrivilegeItems();
    await self.setUpdate('form_data',{
      keys : JSON.stringify(resKeyChoose)
    })
    self.initSubmitValidation(current_form_rules,async function(){
      try{
        let privilegeHttp = new PrivilegeHttpRequest();
        let resPost = await privilegeHttp.updatePrivilege(self.get('form_data'));
        if(resPost.status == "error"){
          throw resPost;
        }
        swalSuccess('Success',gettext("Nouveau Privilège Créé!"));
      }catch(ex){
        console.error('submitData - ex ',ex);
      }
    })
  },
  getPrivilegeData : async function(){
    try{
      let self = this;
      let privilegeHttp = new PrivilegeHttpRequest();
      let resData = await privilegeHttp.getPrivilege(self.root.get('id'));
      return resData;
    }catch(ex){
      console.error('getPrivilegeData - ex ',ex);
      return null;
    }
  },
  setPrivilegeData : async function(props){
    let self = this;
    if(props == null)
      return;
    await self.setUpdate('form_data',props.return);
    let privilege_items = [];
    let parent = $(self.find('#form-create'));
    window.eachObject(self.get('form_data'),function(i,key,val){
      switch(key){
        case 'below_group_id':
          self.below_group_id.dropdown('set selected',val+'');
        break;
        case 'privilege_items':
          privilege_items = val;
          let privItemsDom = $(self.find('#form-create')).find('input[type=checkbox]');
          privItemsDom.each(function(i,dom){
            for(var a=0;a<privilege_items.length;a++){
              if(privilege_items[a].access_type == $(dom).val()){
                $(dom).trigger('click');
                break;
              }
            }
          })
          console.log('setPrivilegeData -> ',props);
        break;
        default:
          $(`input[name=${key}]`).val(val);
        break;
      }
    },100)
  },
})

export default Layout({
  BodyContent : PrivilegeUpdate
})