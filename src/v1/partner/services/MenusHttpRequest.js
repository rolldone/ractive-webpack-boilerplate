import BaseHttpRequest from './BaseHttpRequest';

let MenuHttpRequest = function(){
    let self = (new BaseHttpRequest()).extend();
    self.getMenus = async function(menus_id,bus_param_id,url=null){
        window.staticType(menus_id,[Number,String]);
        window.staticType(bus_param_id,[Number,String]);
        try{
            url = url || window.HTTP_REQUEST.MENU_XHR.MENUS;
            let resdata = await self.getData(url,{
                menus_id : menus_id,
                bussinee_parameter_id : bus_param_id
            });
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.getMenu = async function(id){
        window.staticType(id,[Number]);
        try{
            let url = self.setUrl(window.HTTP_REQUEST.MENU_XHR.VIEW,[{"{id}":id}]);
            let resdata = await self.getData(url);
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.addMenu = async function(props){
        window.staticType(props,[Object]);
        try{
            let url = window.HTTP_REQUEST.MENU_XHR.ADD;
            let formData = self.objectToFormData(props);
            let resdata = await self.postData(url,formData);
            if(resdata.status == 'error'){
                throw resdata;
            }
            return resdata;
        }catch(ex){
            console.error('addPlatMenu - ex ',ex);
            throw ex;
        }
    }
    self.updateMenu = async function(props){
        window.staticType(props,[Object]);
        try{
            let url = window.HTTP_REQUEST.MENU_XHR.UPDATE;
            let formData = self.objectToFormData(props);
            let resdata = await self.postData(url,formData);
            return resdata; 
        }catch(ex){
            console.error('updateMenu - ex ',ex);
            throw ex;
        }
    }
    self.deleteMenu = async function(ids){
        console.log('ids',ids);
        window.staticType(ids,[Array])
        try{
            let url = window.HTTP_REQUEST.MENU_XHR.DELETE;
            let formData = self.objectToFormData({
                ids : JSON.stringify(ids)
            })
            let resdata = await self.postData(url,formData);
            if(resdata.status == "error"){
                throw resdata;
            }
            return resdata
        }catch(ex){
            console.error('deleteMenu - ex ',ex);
            throw ex;
        }
    }
    return self;
}

export default MenuHttpRequest;