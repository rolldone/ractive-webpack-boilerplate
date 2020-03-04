import Layout from "../Layout";
import { Menus } from "./Menus";
import SelfMenusHeaderHttpRequest from "../services/SelfMenusHeaderHttpRequest";

export const MenusSelf = Menus.extend({
  returnNewMenusHeader : function(){
    return new SelfMenusHeaderHttpRequest()
  },
  getDatas: async function() {
    let self = this;
    try {
      let platMenuHttp = self.returnNewMenusHeader();
      let resdata = await platMenuHttp.getMenusHeaders({});
      console.log("resdata", resdata);
      return resdata;
    } catch (ex) {
      console.error("getPlatsMenus - ex ", ex);
    }
  },
  deleteItem: async function(id) {
    let self = this;
    window.staticType(id, [Number]);
    try {
      var menuHeaderHttp = self.returnNewMenusHeader();
      var resData = await menuHeaderHttp.deleteMenuHeader([id]);
      swalSuccess("Success", resData.return);
      self.oncomplete();
    } catch (ex) {
      console.error("deleteItem -> ", ex);
    }
  },
  duplicateItem: async function(id) {
    window.staticType(id, [Number, String]);
    let self = this;
    try {
      let menuHeaderHttp = self.returnNewMenusHeader();
      var resData = await menuHeaderHttp.duplicateMenusHeader(id);
      alert('vmdfkvm');
      if (resData.status == "error") throw resData;
      self.dispatch('menu.view',{
        state : { ":id" : resData.return.id }
      })
    } catch (ex) {
      console.error("duplicateItem - ex ", ex);
    }
  }
});

export default Layout({
	BodyContent : MenusSelf
})