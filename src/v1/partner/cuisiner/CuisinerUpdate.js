import { CuisinerNew } from "./CuisinerNew";
import Layout from "../Layout";
import CuisinerHttpRequest from "../services/CuisinerHttpRequest";

export const CuisinerUpdate = CuisinerNew.extend({
  oncomplete: function() {
    let self = this;
    self._super();
    return new Promise(async resolve => {
      let resData = await self.getData();
      await self.setData(resData);
      resolve();
    });
  },
  submitData: async function() {
    let self = this;
    let current_form_rules = self.get("form_rules");
    self.initSubmitValidation(current_form_rules, async function() {
      try {
        let httpRequest = new CuisinerHttpRequest();
        let resData = await httpRequest.updateCuisiner(self.get("form_data"));
        if (resData.status == "error") throw resData;
        swalSuccess(gettext("Création réussie"));
      } catch (ex) {
        console.error("submitData - ex ", ex);
      }
    });
  },
  getData: async function() {
    let self = this;
    try {
      let httpRequest = new CuisinerHttpRequest();
      let resData = await httpRequest.getCuisiner(self.root.get("id"));
      if (resData.statu == "error") throw resData;
      return resData;
    } catch (ex) {
      console.error("getData - ex ", ex);
    }
  },
  setData: async function(props) {
    window.staticType(props, [Object]);
    let self = this;
    await self.set("form_data", props.return);
    let parent = $(self.find("#form-create"));
    window.eachObject(self.get("form_data"), function(i, key, value) {
      switch (key) {
        case "cuisines_dropdown":
          self.cuisines_dropdown.setValue(value);
          break;
        case "status":
          self.status_dropdown.setValue(value);
          break;
        default:
          parent.find(`input[name=${key}]`).val(value);
          break;
      }
    });
  }
});

export default Layout({
  BodyContent: CuisinerUpdate
});
