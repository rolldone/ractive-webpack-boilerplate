import BaseHttpRequest from "./BaseHttpRequest";

var MenusHeaderHttpRequest = function() {
  let self = new BaseHttpRequest().extend();
  self.getSelfMenusHeaders = async function(props) {
    window.staticType(props, [Object]);
    try {
      let url = window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_MENU_HEADERS;
      let resdata = await self.getData(url, props);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.getSelfMenusHeader = async function(id) {
    window.staticType(id, [Number, String]);
    try {
      let url = self.setUrl(window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_VIEW, [{ "{id}": id }]);
      let resdata = await self.getData(url, {});
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.addSelfMenusHeader = async function(props) {
    window.staticType(props, [Object]);
    try {
      let formData = self.objectToFormData(props);
      let url = window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_ADD;
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.duplicateSelfMenusHeader = async function(id) {
    window.staticType(id, [Number, String]);
    try {
      let formData = self.objectToFormData({});
      let url = self.setUrl(window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_DUPLICATE, [{ "{id}": id }]);
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.updateSelfMenusHeader = async function(props) {
    window.staticType(props, [Object]);
    try {
      let formData = self.objectToFormData(props);
      let url = window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_UPDATE;
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.duplicateMenusHeader = async function(id) {
    window.staticType(id, [Number, String]);
    try {
      let formData = self.objectToFormData({});
      let url = self.setUrl(window.HTTP_REQUEST.MENU_HEADER_XHR.DUPLICATE, [{ "{id}": id }]);
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.deleteSelfMenusHeader = async function(ids) {
    window.staticType(ids, [Array]);
    try {
      let formData = self.objectToFormData({
        ids: JSON.stringify(ids)
      });
      let url = window.HTTP_REQUEST.MENU_HEADER_XHR.DELETE;
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.getMenusHeader = async function(id) {
    try {
      let url = self.setUrl(window.HTTP_REQUEST.MENU_HEADER_XHR.VIEW, [{ "{id}": id }]);
      let resdata = await self.getData(url, {});
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.getMenusHeaders = async function() {
    try {
      let url = window.HTTP_REQUEST.MENU_HEADER_XHR.MENU_HEADERS;
      let resdata = await self.getData(url, {});
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.addMenusHeader = async function(props) {
    try {
      let formData = self.objectToFormData(props);
      let url = window.HTTP_REQUEST.MENU_HEADER_XHR.ADD;
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.updateMenusHeader = async function(props) {
    try {
      let formData = self.objectToFormData(props);
      let url = self.setUrl(window.HTTP_REQUEST.MENU_HEADER_XHR.UPDATE, [{ "{id}": props.id }]);
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.deleteMenuHeader = async function(ids) {
    window.staticType(ids, [Array]);
    try {
      let formData = self.objectToFormData({
        ids: JSON.stringify(ids)
      });
      let url = window.HTTP_REQUEST.MENU_HEADER_XHR.DELETE;
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
