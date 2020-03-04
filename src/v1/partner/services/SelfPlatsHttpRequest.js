import PlatsHttpRequest from "./PlatsHttpRequest";

let SelfPlatsHttpRequest = function(){
    let self = (new PlatsHttpRequest()).extend();
    self.getPlats = async function(whatCategoryId){
        return self.super.getPlats(whatCategoryId,window.HTTP_REQUEST.PRODUCT_XHR.SELF_PRODUCTS);
    }
    self.getPlat = async function(id){
        return self.super.getPlat(id,window.HTTP_REQUEST.PRODUCT_XHR.SELF_PRODUCT);
    }
    self.addPlats = async function(props){
        return self.super.addPlats(props,window.HTTP_REQUEST.PRODUCT_XHR.SELF_ADD);
    }
    self.updatePlats = async function(props){
        return self.super.updatePlats(props,window.HTTP_REQUEST.PRODUCT_XHR.SELF_UPDATE);
    }
    self.deletePlats = async function(ids){
        return self.super.deletePlats(ids,window.HTTP_REQUEST.PRODUCT_XHR.SELF_DELETE);
    }
    return self;
}

export default SelfPlatsHttpRequest;