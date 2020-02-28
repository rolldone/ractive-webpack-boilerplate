import BaseHttpRequest from "./BaseHttpRequest";

const MenusCuisinesHttpRequest = function() {
  let self = new BaseHttpRequest().extend();
  self.getMenusCuisines = async function(props) {
    try {
      let url = window.HTTP_REQUEST.MENU_CUISINE_XHR.MENU_CUISINES;
      let resdata = await self.getData(url, {
        menu_header_id: props.menu_header_id
      });
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.getMenusCuisine = async function(id) {
    try {
      let url = self.setUrl(window.HTTP_REQUEST.MENU_CUISINE_XHR.VIEW, [
        { "{id}": id }
      ]);
      let resdata = await self.getData(url, {});
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.addMenusCuisine = async function(props) {
    try {
      let url = window.HTTP_REQUEST.MENU_CUISINE_XHR.NEW;
      let formData = self.objectToFormData(props);
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      console.error("addMenuCuisine - ex ", ex);
    }
  };
  self.updateMenusCuisine = async function(props) {
    try {
      let formData = self.objectToFormData(props);
      let url = window.HTTP_REQUEST.MENU_CUISINE_XHR.UPDATE;
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.deleteMenusCuisine = async function(ids) {
    try {
      let formData = self.objectToFormData({
        ids: JSON.stringify(ids)
      });
      let url = window.HTTP_REQUEST.MENU_CUISINE_XHR.DELETE;
      let resdata = await self.postData(url, formData);
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  return self;
};

export default MenusCuisinesHttpRequest;