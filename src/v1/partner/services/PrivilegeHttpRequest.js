import BaseHttpRequest from "./BaseHttpRequest";

var PrivilegeHttpRequest = function(){
    let self = (new BaseHttpRequest).extend();
    self.getSelfPrivilege = async function(){
        try{
            let url = window.HTTP_REQUEST.PRIVILEGE_XHR.SELF_PRIVILEGE;
            let resGet = await self.getData(url,{});
            if(resGet.status == "error"){
                throw resGet.data.responseJSON;
            }
            return resGet;
        }catch(ex){
            throw ex;
        }
    }
    self.setSelfPrivilege = function(props){
        console.log('props',props);
        window.staticType(props,[Object]);
        let privilegesSet = {};
        for(var a=0;a<props.privilege_items.length;a++){
            var privItem = props.privilege_items[a];
            privilegesSet[privItem.access_type] = privItem.access_type;
        }
        window.hasPermission = (function(privilege_store_list){
            window.staticType(privilege_store_list,[Object]);
            return function(privilegeCode){
                window.staticType(privilegeCode,[String]);
                if(privilege_store_list[privilegeCode] == null)
                    return false;
                return true;
            }
        })(privilegesSet);
    }
    self.getBelowGroupId = async function(){
        try{
            let url = window.HTTP_REQUEST.PRIVILEGE_XHR.BELOW_GROUP_ID;
            let resGet = await self.getData(url);
            return resGet;
        }catch(ex){
            throw ex;
        }
    }
    self.getPrivileges = async function(){
        try{
            let url = window.HTTP_REQUEST.PRIVILEGE_XHR.PRIVILEGES;
            let resdata = await self.getData(url,{});
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.getPrivilegeItems = async function(){
        try{
            let url = window.HTTP_REQUEST.PRIVILEGE_XHR.PRIVILEGE_ITEMS;
            let resdata = await self.getData(url,{});
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.addPrivilege = async function(props){
        window.staticType(props,[Object]);
        try{
            let formData = self.objectToFormData(props);
            let url = window.HTTP_REQUEST.PRIVILEGE_XHR.ADD;
            let resPost = await self.postData(url,formData);
            return resPost;
        }catch(ex){	
            throw ex;
        }
    }
    self.updatePrivilege = async function(props){
        window.staticType(props,[Object]);
        try{
            let formData = self.objectToFormData(props);
            let url = window.HTTP_REQUEST.PRIVILEGE_XHR.UPDATE;
            let resPost = await self.postData(url,formData);
            return resPost;
        }catch(ex){
            throw ex;
        }
    }
    self.deletePrivilege = async function(ids){
        window.staticType(ids,[Array]);
        try{
            let formData = self.objectToFormData({
                ids : JSON.stringify(ids)
            });
            let url = window.HTTP_REQUEST.PRIVILEGE_XHR.DELETE;
            let resPost = await self.postData(url,formData);
            return resPost;
        }catch(ex){
            throw ex;
        }
    }
    return self;
}

export default PrivilegeHttpRequest;