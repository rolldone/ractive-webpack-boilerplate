import BaseHttpRequest from "../../../lib/BaseHttpRequest";
import config from '@config';

export default function(){
    return (new BaseHttpRequest()).extend({
        getApiRoute : async function(){
            try{
                let url = config.API_LIST;
                let resData = await this.getData(url,{
                    version : ''
                })
                if(resData.status == "error")
                    throw resData.data.responseJSON;
                return resData;
            }catch(ex){
                console.error('getApiRoute - ex ',ex);
            }
        },
        setApiRoute : function(route){
            route = this.super.setApiRoute(route);
            window.HTTP_REQUEST = {
                AUTH_XHR : {
                    LOGIN : route['api.auth.login'],
                    REGISTER : route['api.auth.register']
                }
            }
        },
        
    });
}