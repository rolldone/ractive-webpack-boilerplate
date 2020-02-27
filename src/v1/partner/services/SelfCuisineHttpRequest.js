import CuisinesHttpRequest from "./CuisinesHttpRequest";

export default function(){
    let self = (new CuisinesHttpRequest()).extend();
    self.getCuisine = async function(){
        return self.super.getCuisine(null,window.HTTP_REQUEST.CUISINE_XHR.SELF_VIEW);
    }
    self.updateCuisine = async function(props){
        window.staticType(props,[Object]);
        return self.super.updateCuisine(props,window.HTTP_REQUEST.CUISINE_XHR.SELF_UPDATE);
    }
    self.getCuisineUsers = async function(){
        return self.super.getCuisineUsers(null,window.HTTP_REQUEST.CUISINE_XHR.SELF_CUISINE_USERS);
    }
    self.addCuisineUsers = async function($props){
        window.staticType(props,[Object]);
        return self.super.addCuisineUsers(props,window.HTTP_REQUEST.CUISINE_XHR.SELF_ADD_CUISINE_USERS);
    }
    self.deleteCuisineUsers = async function(ids){
        window.staticType(ids,[Array]);
        return self.super.deleteCuisineUsers(ids,window.HTTP_REQUEST.CUISINE_XHR.SELF_DELETE_CUISINE_USERS);
    }
    return self;
}