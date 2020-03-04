import { MenuTabNew } from "./MenuTabNew";
import MenuUpdate from "./partials/MenuUpdate";
import MenuCuisines from "./partials/MenuCuisines";
import Layout from "../Layout";

export const MenuTabUpdate = MenuTabNew.extend({
  components: {
    "menu-form": MenuUpdate,
    "menu-cuisines": MenuCuisines
  },
  data: function() {
    return {
      tabs: [
        {
          key: "FORM",
          label: gettext("Mettre à jour des menus")
        },
        /* {
          key: "MENU_CUISINES",
          label: gettext("MENUS CUISINE")
        } */
      ]
    };
  },
  onconfig: function() {
    let self = this;
    self._super();
    self.root.findComponent("head-menu").setHeader("page_name", gettext("Mettre à jour des menus"));
  },
  oncomplete: function() {
    let self = this;
    self._super();
    self.menutab = self.findComponent("tab-head");
    console.log("self.menutab", self.menutab);
  }
});

export default Layout({
  BodyContent: MenuTabUpdate
});
