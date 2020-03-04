import BaseHttpRequest from "./BaseHttpRequest";

var MenusHeaderHttpRequest = function() {
  let self = new BaseHttpRequest().extend();
  self.duplicateMenusHeader = async function(id,url=null) {
    window.staticType(id, [Number, String]);
    try {
      let formData = self.objectToFormData({});
      url = self.setUrl(url || window.HTTP_REQUEST.MENU_HEADER_XHR.DUPLICATE, [{ "{id}": id }]);
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.getMenusHeader = async function(id,url=null) {
    try {
      url = self.setUrl(url || window.HTTP_REQUEST.MENU_HEADER_XHR.VIEW, [{ "{id}": id }]);
      let resdata = await self.getData(url, {});
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.getMenusHeaders = async function(props={},url=null) {
    try {
      url = url || window.HTTP_REQUEST.MENU_HEADER_XHR.MENU_HEADERS;
      let resdata = await self.getData(url, props);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.addMenusHeader = async function(props,url=null) {
    try {
      let formData = self.objectToFormData(props);
      url = url || window.HTTP_REQUEST.MENU_HEADER_XHR.ADD;
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.updateMenusHeader = async function(props,url=null) {
    try {
      let formData = self.objectToFormData(props);
      url = url || self.setUrl(window.HTTP_REQUEST.MENU_HEADER_XHR.UPDATE, [{ "{id}": props.id }]);
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.deleteMenuHeader = async function(ids,url=null) {
    window.staticType(ids, [Array]);
    try {
      let formData = self.objectToFormData({
        ids: JSON.stringify(ids)
      });
      url = url || window.HTTP_REQUEST.MENU_HEADER_XHR.DELETE;
      let resdata = await self.postData(url, formData);
      if (resdata.status == "error") throw resdata;
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  return self;
};

export default MenusHeaderHttpRequest;
