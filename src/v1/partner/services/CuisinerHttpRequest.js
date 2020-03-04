import BaseHttpRequest from "./BaseHttpRequest";

var CuisinerHttpRequest = function(){
  let self = (new BaseHttpRequest()).extend();
  self.getCuisiners = async function(props={}){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.CUISINER_XHR.CUISINERS;
      let resDatas = await self.getData(url,props);
      return resDatas;
    }catch(ex){
      throw ex;
    }
  }	
  self.getCuisiner = async function(id){
    window.staticType(id,[Number,String]);
    try{
      let url = self.setUrl(window.HTTP_REQUEST.CUISINER_XHR.VIEW,[{"{id}":id}]);
      let resView = await self.getData(url,{});
      return resView;
    }catch(ex){
      throw ex;
    }
  }
  self.addCuisiner = async function(props){
    window.staticType(props,[Object]);
    try{
      let formData = self.objectToFormData(props);
      let url = window.HTTP_REQUEST.CUISINER_XHR.ADD;
      let resAdd = await self.postData(url,formData);
      return resAdd;
    }catch(ex){
      throw ex;
    }
  }
  self.updateCuisiner = async function(props){
    window.staticType(props,[Object]);
    try{
      let formData = self.objectToFormData(props);
      let url = window.HTTP_REQUEST.CUISINER_XHR.UPDATE;
      let resUpdate = await self.postData(url,formData);
      return resUpdate;
    }catch(ex){
      throw ex;
    }
  }
  self.deleteCuisiner = async function(ids){
    window.staticType(ids,[Array]);
    try{
      let formData = self.objectToFormData({
        ids : JSON.stringify(ids)
      })
      let url = window.HTTP_REQUEST.CUISINER_XHR.DELETE;
      let resDelete = await self.postData(url,formData);
      return resDelete;
    }catch(ex){
      throw ex;
    }
  }
  return self;
}

export default CuisinerHttpRequest;