import BaseHttpRequest from "./BaseHttpRequest";

export default function(){
    let self = (new BaseHttpRequest()).extend();
    self.getProfile = async function(){
        try{
            let url = window.HTTP_REQUEST.USER_XHR.PROFILE;
            let resData = await self.getData(url);
            return resData;
        }catch(ex){
            console.error('userHttpRequest - getProfile ',ex);
            throw ex;
        }
    }
    self.updateProfile = async function(props){
        window.staticType(props,[Object]);
        try{
            let url = window.HTTP_REQUEST.USER_XHR.UPDATE_PROFILE;
            let formData = self.objectToFormData(props);
            let resData = await self.postData(url,formData);
            return resData;
        }catch(ex){
            console.error('userHttpRequest - updateProfile ',ex);
            throw ex;
        }
    }
    self.getUsers = async function(query){
        try{
            let url = window.HTTP_REQUEST.USER_XHR.USERS;
            let resData = await self.getData(url,query);
            return resData;
        }catch(ex){
            console.error('userHttpRequest - getUsers ',ex);
            throw ex;
        }
    }
    self.getUser = async function(id,query){
        try{
            let url = self.setUrl(window.HTTP_REQUEST.USER_XHR.VIEW,[{"{id}":id}]);
            let resData = await self.getData(url,query);
            return resData;
        }catch(ex){
            console.error('userHttpRequest - getUser ',ex);
            throw ex;
        }
    }
    self.getSelfUsers = async function(query){
        window.staticType(query,[Object]);
        try{
            let url = window.HTTP_REQUEST.USER_XHR.SELF_USERS;
            let resGet = await self.getData(url,query);
            return resGet;
        }catch(ex){
            console.error('userHttpRequest - getUsers ',ex);
            throw ex;
        }
    }
    self.getSelfUser = async function(id){
        window.staticType(id,[Number,String]);
        try{
            let url = self.setUrl(window.HTTP_REQUEST.USER_XHR.SELF_VIEW,[{"{id}":id}]);
            let resGet = await self.getData(url,{});
            return resGet;
        }catch(ex){
            throw ex;
        }
    }
    self.createSelfUser = async function(props){
        window.staticType(props,[Object]);
        try{
            let formData = self.objectToFormData(props);
            let url = window.HTTP_REQUEST.USER_XHR.SELF_ADD;
            let resPostData = await self.postData(url,formData);
            return resPostData;
        }catch(ex){
            throw ex;
        }
    }
    self.updateSelfUser = async function(props){
        window.staticType(props,[Object]);
        try{
            let formData = self.objectToFormData(props);
            let url = window.HTTP_REQUEST.USER_XHR.SELF_UPDATE;
            let resPostData = await self.postData(url,formData);
            return resPostData;
        }catch(ex){
            console.error('userHttpRequest - updateSelfUser ',ex);
            throw ex;
        }
    }
    self.deleteSelfUser = async function(ids){
        window.staticType(ids,[Array]);
        try{
            let formData = self.objectToFormData({
                ids : JSON.stringify(ids)
            });
            let url = window.HTTP_REQUEST.USER_XHR.SELF_DELETE;
            let resPostData = await self.postData(url,formData);
            return resPostData;
        }catch(ex){
            throw ex;
        }
    }
    self.createUser = async function(props){
        try{
            let formData = self.objectToFormData(props);
            let url = window.HTTP_REQUEST.USER_XHR.ADD;
            let resData = await self.postData(url,formData);
            return resData;
        }catch(ex){
            console.error('userHttpRequest - createUser ',ex);
            throw ex;
        }
    }
    self.updateUser = async function(id,props){
        try{
            let formData = self.objectToFormData(props);
            let url = self.setUrl(window.HTTP_REQUEST.USER_XHR.UPDATE,[{"{id}":id}]);
            let resData = await self.postData(url,formData);
            return resData;
        }catch(ex){
            console.error('userHttpRequest - updateUser ',ex);
            throw ex;
        }
    }
    self.deleteUser = async function(ids){
        try{
            let formData = self.objectToFormData({
                ids : JSON.stringify(ids)
            })
            let url = window.HTTP_REQUEST.USER_XHR.DELETE;
            let resData = await self.postData(url,formData);
            return resData;
        }catch(ex){
            console.error('userHttpRequest - deleteUsers ',ex);
            throw ex;
        }
    }
    return self;
}