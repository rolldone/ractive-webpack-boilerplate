import Layout from "../Layout";
import { MenuTabUpdate } from "./MenuTabUpdate";
import MenuUpdate from "./partials/MenuUpdate";
import SelfMenusHeaderHttpRequest from "../services/SelfMenusHeaderHttpRequest";
import FoodMenus from "./partials/FoodMenus";
import SelfPlatsHttpRequest from "../services/SelfPlatsHttpRequest";
/* 
    Overriding FoddMenu.js
*/
const SelfFoodMenus = FoodMenus.extend({
  getPlatsMenuByBussineParamId: async function() {
    let self = this;
    let bus_param_id = self.get("bus_param_id");
    if (bus_param_id == null) return null;
    try {
      let platsMenuHttpRequest = new SelfPlatsHttpRequest();
      let resData = await platsMenuHttpRequest.getPlats({
        category_id : bus_param_id,
      });
      return resData;
    } catch (ex) {
      console.error("getMenusByCategory - ex ", ex);
    }
  }
})
/* 
    Overrding MenuUpdate Partials
*/
const MenuSelfUpdate = MenuUpdate.extend({
  components : {
    "food-menus" : SelfFoodMenus
  },
  returnNewMenusHeaderHttpRequest : function(){
    return new SelfMenusHeaderHttpRequest();
  },
  getMenuHeader: async function() {
    let self = this;
    try {
      let menuHeaderHttp = self.returnNewMenusHeaderHttpRequest();
      let resData = await menuHeaderHttp.getMenusHeader(self.root.get('id'));
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  submit: function() {
    let self = this;
    self.initSubmitValidation(self.get("form_rules"), async function() {
      let menusHeader = self.returnNewMenusHeaderHttpRequest();
      let resData = await menusHeader.updateMenusHeader(self.get("form_data"));
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
