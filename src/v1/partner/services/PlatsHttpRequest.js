import BaseHttpRequest from "./BaseHttpRequest";

let PlatsHttpRequest = function(){
    let self = (new BaseHttpRequest()).extend();
    self.getPlats = async function(props,url=null){
        window.staticType(props,[Object]);
        try{
            url = url || window.HTTP_REQUEST.PRODUCT_XHR.PRODUCTS;
            let resdata = await self.getData(url,{
                category_id : props.category_id,
                cuisine_id : props.cuisine_id
            });
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.getPlat = async function(id,url){
        try{
            url = url || self.setUrl(window.HTTP_REQUEST.PRODUCT_XHR.VIEW,[{"{id}":id}]);
            let resdata = await self.getData(url);
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.addPlats = async function(props,url=null){
        try{
            url = url || window.HTTP_REQUEST.PRODUCT_XHR.ADD;
            let formData = self.objectToFormData(props);
            let resdata = await self.postData(url,formData);
            return resdata;
        }catch(ex){
            console.error('addPlatMenu - ex ',ex);
        }
    }
    self.updatePlats = async function(props,url=null){
        try{
            url = url || window.HTTP_REQUEST.PRODUCT_XHR.UPDATE;
            let formData = self.objectToFormData(props);
            let resdata = await self.postData(url,formData);
            return resdata; 
        }catch(ex){
            console.error('updatePlats - ex ',ex);
        }
    }
    self.deletePlats = async function(ids,url=null){
        try{
            url = url || window.HTTP_REQUEST.PRODUCT_XHR.DELETE;
            let formData = self.objectToFormData({
                ids : JSON.stringify(ids)
            })
            let resdata = await self.postData(url,formData);
            return resdata
        }catch(ex){
            console.error('deletePlats - ex ',ex);
        }
    }
    self.getProductCuisines = async function(plats_id){
        try{
            let url = self.setUrl(window.HTTP_REQUEST.PRODUCT_XHR.PRODUCT_CUISINES,[{"{id}":plats_id}]);
            let resdata = await self.getData(url);
            return resdata;
        }catch(ex){
            console.error('getProductCuisines - ex ',ex);
        }
    }
    self.addProductCuisine = async function(props){
        try{
            let url = self.setUrl(window.HTTP_REQUEST.PRODUCT_XHR.ADD_PRODUCT_CUISINE,[{"{id}":props.plats_id}]);
            let formData = self.objectToFormData(props);
            let resdata = await self.postData(url,formData);
            return resdata;
        }catch(ex){
            console.error('addProductCuisine - ex ',ex);
        }
    }
    self.deleteProductCuisine = async function(plat_id,ids){
        try{
            let url = self.setUrl(window.HTTP_REQUEST.PRODUCT_XHR.DELETE_PRODUCT_CUISINE,[{"{id}":plat_id}]);
            let formData = self.objectToFormData({
                ids : JSON.stringify(ids)
            })
            let resdata = await self.postData(url,formData);
            return resdata;
        }catch(ex){
            console.error('deleteProductCuisine - ex ',ex);
        }
    }
    return self;
}

export default PlatsHttpRequest;