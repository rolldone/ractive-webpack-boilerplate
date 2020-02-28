import InputSearchDropdown from '@v1/components/input/InputSearchDropdown';
import template from './views/MenuCuisinesView.html';
import MenusCuisinesHttpRequest from '../../services/MenuCuisinesHttpRequest';
import BaseRactive from 'BaseRactive';
import CuisinesHttpRequest from '../../services/CuisinesHttpRequest';

const MenuCuisines = BaseRactive.extend({
  template,
  components: {
    "input-search-dropdown": InputSearchDropdown
  },
  data: function() {
    return {
      cuisines: [],
      submit: gettext("Ajoutez-le"),
      form_data: {},
      form_rules: {
        cuisine_id: "required|numeric"
      }
    };
  },
  onconfig: function() {
    let self = this;
		self._super();
		return new Promise(async function(){
			let resData = await self.getCuisines();
			self.setCuisines(resData);
		})
  },
  oncomplete: function() {
    let self = this;
		self._super();
		return new Promise(async function(){
			let resData = await self.getMenusCuisines();
			self.setMenusCuisines(resData);
		})
  },
  handleClick: async function(action, props, e) {
    let self = this;
    switch (action) {
      case "SUBMIT":
        e.preventDefault();
        self.initSubmitValidation(self.get("form_rules"), function() {
          self.submitCuisine();
        });
        break;
      case "DELETE_ITEM":
        try {
          var menusHttp = new MenusCuisinesHttpRequest();
          var resData = await menusHttp.deleteMenusCuisine([props.id]);
          resData = await self.getMenusCuisines();
          self.setMenusCuisines(resData);
        } catch (ex) {
          console.error("handleClick - er ", ex);
        }
        break;
    }
  },
  initSubmitValidation: function(form_rule, callback) {
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
  getCuisines: async function() {
    let self = this;
    try {
      let cuisinesRequest = new CuisinesHttpRequest();
      let resData = await cuisinesRequest.getCuisines();
      return resData;
    } catch (ex) {
      console.log("getCuisines - ex ", ex);
    }
  },
  setCuisines: async function(props) {
		console.log('action',props);
    let self = this;
    switch (props.action) {
      case "error":
        return console.error("setCuisines - ex ", props);
    }
    await self.set("cuisines", props.return);
    self.inputSearchDropdown = self.findComponent("input-search-dropdown");
    self.inputSearchDropdown.setOnChangeListener(async function(props) {
      self.set("form_data", {
        menu_header_id: self.root.get('id'),
        cuisine_id: props.value
      });
    });
  },
  getMenusCuisines: async function() {
    let self = this;
    try {
      let menusHttp = new MenusCuisinesHttpRequest();
      let resData = await menusHttp.getMenusCuisines({
        menu_header_id: self.root.get('id')
      });
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  setMenusCuisines: function(props) {
    let self = this;
    switch (props.action) {
      case "error":
        return console.error("setMenusCuisines - ex ", props);
    }
    self.set("datas", props.return);
  },
  submitCuisine: async function() {
    let self = this;
    try {
      let menusHttp = new MenusCuisinesHttpRequest();
      let resData = await menusHttp.addMenusCuisine(self.get("form_data"));
      console.log("resData", resData);
      resData = await self.getMenusCuisines();
      self.setMenusCuisines(resData);
    } catch (ex) {
      console.error("submitCuisine - ex ", ex);
    }
  }
});

export default MenuCuisines;