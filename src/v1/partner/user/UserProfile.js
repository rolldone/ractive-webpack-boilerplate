import Layout from "../Layout";
import template from "./views/UserProfileView.html";
import UserHttpRequest from "../services/UserHttpRequest";
import { UserUpdate } from "./UserUpdate";

export const UserProfile = UserUpdate.extend({
  template,
  handleClick: function(action, props, e) {
    let self = this;
    self._super(action, props, e);
    switch (action) {
      case "MODAL_IMPORT":
        e.preventDefault();
        $(".import-img ").modal("show");
        break;
    }
  },
  returnNewHttpRequest: function() {
    return new UserHttpRequest();
  },
  submitData: function() {
    let self = this;
    let current_form_rules = self.get("form_rules");
    var initSubmitValidation = self.initSubmitValidation.bind(self, current_form_rules, async function() {
      try {
        let userHttp = self.returnNewHttpRequest();
        let resData = await userHttp.updateProfile(self.get("form_data"));
        if (resData.status == "error") {
          throw resData;
        }
        swalSuccess("Success", gettext("Utilisateur mis à jour!"));
      } catch (ex) {
        console.error("submitData - ex ", ex);
      }
    });
    if (self.get("form_data").password != null) {
      self.initSubmitValidation(self.get("form_rules_password"), initSubmitValidation);
      return;
    }
    initSubmitValidation();
  },
  getUser: async function() {
    let self = this;
    try {
      let userHttp = self.returnNewHttpRequest();
      let resData = await userHttp.getProfile();
      if (resData.status == "error") {
        throw resData;
      }
      return resData;
    } catch (ex) {
      console.error("getProfile - ex ", ex);
    }
  },
  setUser: async function(props) {
    window.staticType(props, [Object]);
    let self = this;
    await self.set("form_data", props.return);
    let parent = $(self.find("#form-create"));
    window.eachObject(
      self.get("form_data"),
      function(i, key, val) {
        switch (key) {
          case "photo":
            let photo = self.assetApiUrl("/storage/user/" + val);
            console.log('vdfvf',photo);
            parent.find(`#preview`).attr("src", photo);
            break;
          default:
            parent.find(`input[name=${key}]`).val(val);
            break;
        }
      },
      100
    );
  }
});

export default Layout({
  BodyContent: UserProfile
});
