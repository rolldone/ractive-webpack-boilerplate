import BaseRactive from "BaseRactive";
import template from "./views/MenuNewView.html";
import InputCheckbox from "../../../components/input/InputCheckbox";
import InputText from '@v1/components/input/Input';
import InputDropdown from "../../../components/input/InputDropdown";
import MenusHeaderHttpRequest from "../../services/MenusHeaderHttpRequest";
import CuisinesHttpRequest from "../../services/CuisinesHttpRequest";

const MenuNew = BaseRactive.extend({
  template,
  components: {
    "input-checkbox": InputCheckbox,
    "input-text": InputText,
    "input-dropdown": InputDropdown,
    "cuisine-dropdown" : InputDropdown
  },
  data: function() {
    return {
      form_data: {},
      form_rules: {
        date: "required",
        cuisine_id : 'required'
      },
      menu_datas: [],
      submit: gettext("ENREGISTRER"),
      cuisines_datas : []
    };
  },
  oncomplete: function() {
    let self = this;
    self._super();
    return new Promise(async (resolve)=>{
      self.initCalendar();
      if(hasPermission('menu.add') == true){
        self.cuisine_dropdown = self.findComponent('cuisine-dropdown');
        self.cuisine_dropdown.setOnChangeListener((val,e)=>{
          self.setUpdate('form_data',{
            cuisine_id : val.value
          })
        })
      }
      self.setCuisines(await self.getCuisines());
      resolve();
    })
  },
  returnNewMenusHeaderHttpRequest: function() {
    return new MenusHeaderHttpRequest();
  },
  returnNewCuisinesHttpRequest : function(){
    return new CuisinesHttpRequest();
  },
  initSubmitValidation: function(form_rule, callback) {
    window.staticType(form_rule, [Object]);
    window.staticType(callback, [Function]);

    let self = this;
    console.log("self", self.get("form_data"));
    let currentFormData = self.get("form_data");
    console.log("currentFormData", currentFormData);
    self.submitValidation(
      {
        form_data: self.get("form_data"),
        form_rules: form_rule
      },
      function(res) {
        console.log("res", res);
        let parent = $(self.find("form")).first(); // $(self.find('#form-create'));
        console.log("parent", parent);
        for (var key in res.error) {
          switch (key) {
            default:
              setTimeout(
                function(key) {
                  var rr = parent.find("input[name=" + key + "]");
                  rr = rr.parents(".field").first();
                  rr.find("span.error").text(res.error[key]);
                }.bind(self, key),
                100
              );
              break;
          }
        }
        for (var key in res.form_data) {
          switch (key) {
            default:
              setTimeout(
                function(key) {
                  var rr = parent.find("input[name=" + key + "]");
                  rr = rr.parents(".field").first();
                  rr.find("span.error").text("");
                }.bind(self, key),
                100
              );
              break;
          }
        }
        if (res.status == "complete") {
          callback(res.form_data);
        }
      }
    );
  },
  initCalendar: function() {
    let self = this;
    self.dateCalendar = $("input[name=date]").daterangepicker(
      {
        singleDatePicker: true,
        showDropdowns: true,
        minDate: moment()
      },
      function(start, end, label) {
        self.setUpdate("form_data", {
          date: start.format("YYYY-MM-DD 00:00:00")
        });
      }
    );
    self.setUpdate("form_data", {
      date: moment().format("YYYY-MM-DD 00:00:00")
    });
  },
  handleClick: async function(action, props, e) {
    if (e != null) e.preventDefault();
    window.staticType(action, [String]);
    window.staticType(props, [Object]);
    let self = this;
    switch (action) {
      case "SUBMIT":
        e.preventDefault();
        self.submit();
        break;
      case "BACK":
        e.preventDefault();
        return window.history.back();
    }
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
      return self.dispatch('menu.view',{
        state : {
          ':id' : resData.return.id
        },
        noHistory : true
      })
      window.location.href = self.setUrl(window.HTTP_REQUEST.MENU_HEADER.VIEW, [
        { ":id": resData.return.id }
      ]);
      console.log(
        "update",
        self.setUrl(window.HTTP_REQUEST.MENU_HEADER.VIEW, [
          { ":id": resData.return.id }
        ])
      );
    });
  },
  getCuisines : async function(){
    let self = this;
    try{
      let httpRequest = self.returnNewCuisinesHttpRequest();
      let resData = await httpRequest.getCuisines({});
      return resData;
    }catch(ex){
      console.error('getCuisines - ex ',ex);
      return null;
    }
  },
  setCuisines : function(props){
    let self = this;
    if(props == null){
      return;
    }
    self.set('cuisines_datas',props.return);
  }
});

export default MenuNew;
