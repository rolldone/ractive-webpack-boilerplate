import BaseHttpRequest from "./BaseHttpRequest";

export default function(){
    let self = (new BaseHttpRequest()).extend();
    self.getCuisines = async function(props={}){
        try{
            let resdata = await self.getData(window.HTTP_REQUEST.CUISINE_XHR.CUISINES,props);
            if(resdata.status == 'error'){
                throw resdata.data.responseJSON;
            }
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.getCuisine = async function(id,url=null){
        window.staticType(id,[null,String,Number]);
        try{
            url = url || self.setUrl(window.HTTP_REQUEST.CUISINE_XHR.VIEW,[{"{id}":id}]);
            let resdata = await self.getData(url,{});
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.addCuisine = async function(props){
        try{
            let formData = self.objectToFormData(props);
            let resdata = await self.postData(window.HTTP_REQUEST.CUISINE_XHR.ADD,formData);
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.deleteCuisine = async function(ids){
        window.staticType(ids,[Array]);
        try{
            let formData = self.objectToFormData({
                ids : JSON.stringify(ids)
            });
            let resdata = await self.postData(window.HTTP_REQUEST.CUISINE_XHR.DELETE,formData);
            if(resdata.status == "error")
                throw resdata.data.responseJSON;
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.updateCuisine = async function(props,url){
        window.staticType(props,[Object]);
        window.staticType(url,[null,String]);
        try{
            let formData = self.objectToFormData(props);
            url = url || window.HTTP_REQUEST.CUISINE_XHR.UPDATE;
            let resdata = await self.postData(url,formData);
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.getCuisineUsers = async function(id,url){
        window.staticType(id,[null,Number,String]);
        window.staticType(url,[null,String]);
        try{
            url = url || self.setUrl(window.HTTP_REQUEST.CUISINE_XHR.CUISINE_USERS,[{"{id}":id}]);
            let resdata = await self.getData(url,{});
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.addCuisineUsers = async function(props,url){
        window.staticType(props,[Object]);
        window.staticType(url,[null,String]);
        try{
            url = url || self.setUrl(window.HTTP_REQUEST.CUISINE_XHR.ADD_CUISINE_USER,[{"{id}":props.id}]);
            let formData = self.objectToFormData(props);
            let resdata = await self.postData(url,formData);
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.deleteCuisineUsers = async function(props,url){
        window.staticType(props,[Object]);
        window.staticType(url,[null,String]);
        try{
            url = url || self.setUrl(window.HTTP_REQUEST.CUISINE_XHR.DELETE_CUISINE_USER,[{"{id}":props.id}]);
            let formData = self.objectToFormData({
                ids : JSON.stringify(props.ids)
            });
            let resdata = await self.postData(url,formData);
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    return self;
}