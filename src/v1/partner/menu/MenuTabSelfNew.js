import Layout from "../Layout";
import { MenuTabNew } from "./MenuTabNew";
import MenuNew from "./partials/MenuNew";
import SelfMenusHeaderHttpRequest from "../services/SelfMenusHeaderHttpRequest";

const MenuSelfNew = MenuNew.extend({
  data : function(){
    return {
      form_rules: {
        date: "required",
        /* Remove karena untuk self menu */
        /* cuisine_id : 'required' */
      },
    }
  },
  returnNewMenusHeaderHttpRequest : function(){
    return new SelfMenusHeaderHttpRequest();
  },
  submit: function() {
    let self = this;
    self.initSubmitValidation(self.get("form_rules"), async function() {
      let menusHeader = self.returnNewMenusHeaderHttpRequest();
      let resData = await menusHeader.addMenusHeader(self.get("form_data"));
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
