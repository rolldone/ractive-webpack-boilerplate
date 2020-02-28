import BaseHttpRequest from "./BaseHttpRequest";

let StockMenuHttpRequest = function(){
    let self = (new BaseHttpRequest()).extend();
    self.getStockMenu = async function(id){
        try{
            let url = self.setUrl(window.HTTP_REQUEST.MENU_STOCK_XHR.VIEW,[{"{id}":id}]);
            let resdata = await self.getData(url,{});
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.getStockMenus = async function(menus_id){
        window.staticType(menus_id,[Number]);
        try{
            let url = window.HTTP_REQUEST.MENU_STOCK_XHR.MENU_STOCKS;
            let resdata = await self.getData(url,{
                menus_id : menus_id,
            });
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.addStockMenu = async function(props){
        try{
            let formData = self.objectToFormData(props);
            console.log('props',props);
            let url = window.HTTP_REQUEST.MENU_STOCK_XHR.NEW;
            let resdata = await self.postData(url,formData);
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.updateStockMenu = async function(props){
        try{
            let formData = self.objectToFormData(props);
            let url = window.HTTP_REQUEST.MENU_STOCK_XHR.UPDATE;
            let resdata = await self.postData(url,formData);
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    self.deleteStockMenu = async function(props){
        try{
            let formData = self.objectToFormData(props);
            let url = window.HTTP_REQUEST.MENU_STOCK_XHR.DELETE;
            let resdata = await self.postData(url,formData);
            return resdata;
        }catch(ex){
            throw ex;
        }
    }
    return self;
}

export default StockMenuHttpRequest;