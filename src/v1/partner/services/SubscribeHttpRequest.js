import BaseHttpRequest from "./BaseHttpRequest";

var SubscribeHttpRequest = function(){
  let self = (new BaseHttpRequest()).extend();
  self.getSubscribes = async function(props){
    window.staticType(props,[Object]);
    try{
      let resdata = await self.getData(window.HTTP_REQUEST.SUBSCRIBE_XHR.SUBSCRIBES,props);
      if(resdata.status == 'error')
        throw resdata.data.responseJSON;
      return resdata; 
    }catch(ex){
      throw ex;
    }
  }
  self.getSubscribe = async function(id){
    window.staticType(id,[String,Number]);
    try{
      let url = self.setUrl(window.HTTP_REQUEST.SUBSCRIBE_XHR.VIEW,[{":id":id}]);
      let resdata = await self.getData(url,{});
      if(resdata.status == "error")
        throw resdata.data.responseJSON;
      return resdata; 
    }catch(ex){
      throw ex;
    }
  }
  self.deleteSubscribe = async function(ids){
    window.staticType(ids,[Array]);
    try{
      let formdata = self.objectToFormData({
        ids : JSON.stringify(ids)
      })
      let resdata = await self.postData(window.HTTP_REQUEST.SUBSCRIBE_XHR.DELETE,formdata);
      if(resdata.status == "error")
        throw resdata.data.responseJSON;
      return resdata;
    }catch(ex){
      throw ex;
    }
  }
  return self;
}

export default SubscribeHttpRequest;