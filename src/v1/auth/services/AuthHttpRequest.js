import BaseHttpRequest from "./BaseHttpRequest";

export default function(){
    return (new BaseHttpRequest()).extend({
        login : async function(props){
            window.staticType(props,[Object]);
            try{
                console.log('prop',props);
                let formData = this.objectToFormData(props);
                let resData = await this.postData(window.HTTP_REQUEST.AUTH_XHR.LOGIN,formData);
                if(resData.status == "error")
                    throw resData.data.responseJSON;
                return resData;
            }catch(ex){
                console.error('login - ex ',ex);
            }
        },
        register : async function(props){
            window.staticType(props,[Object]);
            try{
                let formData = this.objectToFormData(props);
                let resData = await this.postData(window.HTTP_REQUEST.AUTH_XHR.REGISTER,formData);
                if(resData.status == "error")
                    throw resData.data.responseJSON;
                return resData;
            }catch(ex){
                console.error('register - ex ',ex);
            }
        }
    })
}