import Layout from "../Layout";
import { MenuTabUpdate } from "./MenuTabUpdate";
import MenuUpdate from "./partials/MenuUpdate";
/* 
    Overrding MenuUpdate Partials
*/
const MenuSelfUpdate = MenuUpdate.extend({
  getMenuHeader: async function() {
    let self = this;
    try {
      let menuHeaderHttp = self.returnNewMenusHeaderHttpRequest();
      let resData = await menuHeaderHttp.getSelfMenusHeader(self.root.get('id'));
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  submit: function() {
    let self = this;
    self.initSubmitValidation(self.get("form_rules"), async function() {
      let menusHeader = self.returnNewMenusHeaderHttpRequest();
      let resData = await menusHeader.updateSelfMenusHeader(self.get("form_data"));
      console.log("resData", resData);
      switch (resData.action) {
        case "error":
          return console.error("handleClick - submit - ex", ex);
      }
    });
  }
});
/* 
    Overriding MenuTabUpdate
*/
export const MenuTabSelfUpdate = MenuTabUpdate.extend({
  components: {
    "menu-form": MenuSelfUpdate,
    "menu-cuisines": null
  },
  data: function() {
    return {
      tabs: [
        {
          key: "FORM",
          label: gettext("Créer une nouvelle plat")
        }
      ]
    };
  }
});

export default Layout({
  BodyContent : MenuTabSelfUpdate
});
