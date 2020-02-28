import Layout from "../Layout";
import { MenuTabNew } from "./MenuTabNew";

const MenuSelfNew = MenuNew.extend({
  submit: function() {
    let self = this;
    self.initSubmitValidation(self.get("form_rules"), async function() {
      let menusHeader = self.returnNewMenusHeaderHttpRequest();
      let resData = await menusHeader.addSelfMenusHeader(self.get("form_data"));
      console.log("resData", resData);
      switch (resData.action) {
        case "error":
          return console.error("handleClick - submit - ex", ex);
      }
      return self.dispatch("menu.view", {
        state: { ":id": resData.return.id }
      });
    });
  }
});

export const MenusTabSelfNew = MenuTabNew.extend({
  components: {
    "menu-form": MenuSelfNew
  }
});

export default Layout({
  BodyContent: MenusTabSelfNew
});
