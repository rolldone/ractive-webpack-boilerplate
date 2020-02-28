import ListTable from "@v1/components/ListTable";
import MenusHeaderHttpRequest from "../services/MenusHeaderHttpRequest";
import template from "./views/MenusView.html";
import Layout from "../Layout";

export const Menus = ListTable.extend({
  template,
  returnNewMenusHeader: function() {
    return new MenusHeaderHttpRequest();
  },
  onconfig: function() {
    let self = this;
    self._super();
    self.root.findComponent("head-menu").setHeader("page_name", gettext("Liste des menus"));
  },
  oncomplete: function() {
    let self = this;
    self._super();
  },
  getDatas: async function() {
    let self = this;
    try {
      let platMenuHttp = self.returnNewMenusHeader();
      let resdata = await platMenuHttp.getMenusHeaders();
      console.log("resdata", resdata);
      return resdata;
    } catch (ex) {
      console.error("getPlatsMenus - ex ", ex);
    }
  },
  setDatas: function(props) {
    let self = this;
    switch (props.action) {
      case "error":
        return console.error("setPlatsMenus - ex ", props);
    }
    self.set("datas", props.return);
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
      if (resData.status == "error") throw resData;
      self.dispatch('menu.view',{
        state : { ":id" : resData.return.id }
      });
    } catch (ex) {
      console.error("duplicateItem - ex ", ex);
    }
  },
  handleClick: function(action, props, e) {
    window.staticType(action, [String]);
    window.staticType(props, [Object]);
    let self = this;
    self._super(action, props, e);
    return new Promise(async resolve => {
      switch (action) {
        case "DUPLICATE_ITEM":
          await self.duplicateItem(props.id);
          break;
      }
      resolve();
    });
  },
  newOn: {
    observeFilterButtonClickListener: function(c, text, object) {
      let self = this;
      switch (text) {
        case "ADD":
          return self.dispatch("menu.new");
        case "SEARCH":
          self.setUpdate("filter", {
            search: object.value
          });
          setTimeout(function() {
            self.set("update_state", new Date());
          }, 1000);
          return;
        case "RIGHT_BTN_CLICK":
          return self.rightMenu.show([
            // {
            //   label : 'Reset',
            //   href : '',
            //   action : 'RESET'
            // },
            {
              label: "Deleted",
              href: "",
              action: "DELETED"
            },
            {
              label: "Unselected",
              href: "",
              action: "UNSELECTED"
            }
          ]);
      }
    }
  }
});

export default Layout({
  BodyContent: Menus
});
