import BaseRactive from 'BaseRactive';
import template from './views/FoodMenusView.html';
import StockHistories from './StockHistories';
import InputDropdown from '@v1/components/input/InputDropdown';
import InputText from '@v1/components/input/Input';
import InputCheckbox from '@v1/components/input/InputCheckbox';
import PlatsHttpRequest from '../../services/PlatsHttpRequest';
import MenuHttpRequest from '../../services/MenusHttpRequest';

const FoodMenus = BaseRactive.extend({
  template,
  components: {
    "stock-histories": StockHistories,
    "input-dropdown": InputDropdown,
    "input-text": InputText,
    "input-checkbox": InputCheckbox
  },
  data: function() {
    return {
      title: "",
      menu_header_id: null,
      bus_param_id: null,
      form_update_rules: {
        initial_value: "required|numeric",
        last_stock_total: "required|numeric",
        action: "required",
        plats_id: "required"
      },
      form_data: {
        plats_id: null
      },
      actions_datas: [
        {
          id: "add",
          name: "Add"
        },
        {
          id: "reduce",
          name: "Reduce"
        }
      ],
      plats_menus: [],
      saved_menus: []
    };
  },
  oncomplete: function() {
    let self = this;
		self._super();
		return new Promise(async function(){
			let resData = await self.getPlatsMenuByBussineParamId();
			self.setPlatsMenu(resData);
			self.selectDropdown = self.findComponent("input-dropdown");
			self.selectDropdown.setOnChangeListener(async function(props, e) {
				console.log("props", props);
				console.log("e", e);
				self.setUpdate("form_data", {
					plats_id: props.value
				});
			});
			resData = await self.getMenus();
			self.setMenus(resData);
			self.stockHistories = self.findComponent("stock-histories");
			self.initTextValidation();
			feather.replace();
		})
  },
  initTextValidation: function() {
    let self = this;
    self.inputTextValidation(
      self.find(`#form-update-${self.get("bus_param_id")}`),
      {
        form_data: self.get("form_data"),
        form_rules: self.get("form_update_rules"),
        element_target:
          "input[type=text],input[type=email],input[type=number],textarea"
      },
      function(res, e) {
        self.setUpdate("form_data", res.form_data).then(function() {
          let parent = $(e.target)
            .parents(".field")
            .first();
          switch (res.status) {
            case "error":
              return parent.find("span.error").text(res.message);
            case "valid":
            case "complete":
              return parent.find("span.error").text("");
          }
        });
      }
    );
  },
  initSubmitValidation: function(form_rule, callback) {
    window.staticType(form_rule, [Object]);
    window.staticType(callback, [Function]);
    let self = this;
    let currentFormData = self.get("form_data");
    self.submitValidation(
      {
        form_data: self.get("form_data"),
        form_rules: form_rule
      },
      function(res) {
        let parent = $(`#form-update-${self.get("bus_param_id")}`); // $(self.find('#form-create'));
        for (var key in res.error) {
          switch (key) {
            default:
              var fixKey = key;
              $.when(parent.find("input[name=" + fixKey + "]")).done(function(
                rr
              ) {
                rr = rr.parents(".field").first();
                rr.find("span.error").text(res.error[fixKey]);
              });
              break;
          }
        }
        for (var key in res.form_data) {
          switch (key) {
            default:
              var fixKey = key;
              $.when(parent.find("input[name=" + fixKey + "]")).then(function(
                rr
              ) {
                rr = rr.parents(".field").first();
                rr.find("span.error").text("");
              });
              break;
          }
        }
        if (res.status == "complete") {
          callback(res.form_data);
        }
      }
    );
  },
  getPlatsMenuByBussineParamId: async function() {
    let self = this;
    let bus_param_id = self.get("bus_param_id");
    if (bus_param_id == null) return null;
    try {
      let platsMenuHttpRequest = new PlatsHttpRequest();
      let resData = await platsMenuHttpRequest.getPlats(bus_param_id);
      return resData;
    } catch (ex) {
      console.error("getMenusByCategory - ex ", ex);
    }
  },
  setPlatsMenu: function(props) {
    window.staticType(props, [Object]);
    let self = this;
    if (props == null) return;
    switch (props.action) {
      case "error":
        return console.error("setPlatsMenu - ex ", props);
    }
    self.set("plats_menus", props.return);
  },
  getMenus: async function() {
    let self = this;
    try {
      let bus_param_id = self.get("bus_param_id");
      let menu_header_id = self.get("menu_header_id");
      let menuHttp = new MenuHttpRequest();
      let resData = await menuHttp.getMenus(menu_header_id, bus_param_id);
      return resData;
    } catch (ex) {
      console.error("getStockMenus - ex ", ex);
    }
  },
  setMenus: function(props) {
    window.staticType(props, [Object]);
    let self = this;
    switch (props.action) {
      case "error":
        return console.error("setStockMenus - ex ", props);
    }
    self.set("saved_menus", props.return);
  },
  getLastStock: function(props) {
    window.staticType(props, [Object]);
    return props.initial_value - props.credit + props.debet;
  },
  handleClick: async function(action, props, e) {
    if (e != null) e.preventDefault();
    window.staticType(action, [String]);
    window.staticType(props, [Object]);
    window.staticType(e, [Object]);
    let self = this;
    switch (action) {
      case "CANCEL":
        await self.set("form_data", {});
        self.selectDropdown = self.findComponent("input-dropdown");
        self.selectDropdown.setOnChangeListener(async function(props, e) {
          self.setUpdate("form_data", {
            plats_id: props.value
          });
        });
        break;
      case "ADD":
        let bus_param_id = self.get("bus_param_id");
        let menu_header_id = self.get("menu_header_id");
        let plats_id = self.get("form_data").plats_id;
        let initial_value = self.get("form_data").initial_value;
        let plats_menus = self.get("plats_menus");
        var saved_menus = self.get("saved_menus");
        let isAllreadySaved = false;
        for (var a = 0; a < saved_menus.length; a++) {
          if (saved_menus[a].id == parseInt(plats_id)) {
            isAllreadySaved = true;
            break;
          }
        }
        if (isAllreadySaved == false) {
          for (var a = 0; a < plats_menus.length; a++) {
            if (parseInt(plats_id) == plats_menus[a].id) {
              self.temp_saved_menus = plats_menus[a];
              break;
            }
          }
          console.log("self.temp_saved_menus", self.temp_saved_menus);
          await self.saveHttpRequest({
            initial_value: initial_value,
            plats_id: plats_id,
            menu_header_id: menu_header_id,
            bussinee_parameter_id: bus_param_id
          });
          self.oncomplete();
        }
        feather.replace(); // Fungsi supaya icon nya muncul
        break;
      case "UPDATE":
        self.initSubmitValidation(self.get("form_update_rules"), function() {
          self.updateHttpRequest();
        });
        break;
      case "DETAIL":
        var saved_menus = self.get("saved_menus");
        // Call history by menus
        self.stockHistories.findRecordHistory(props.id);
        // Get menu by id
        var resData = await self.getMenu(props.id);
        self.setMenu(resData);
        break;
      case "DELETE":
        await self.deleteHttpRequest(props.id);
        var resData = await self.getMenus();
        self.setMenus(resData);
        break;
      case "CONFIG":
        var saved_menus = self.get("saved_menus");
        self.onActionListener("CONFIG", saved_menus[props.index]);
        break;
    }
  },
  setOnActionListener: function(onActionListener) {
    window.staticType(onActionListener, [Function]);
    let self = this;
    self.onActionListener = onActionListener;
  },
  deleteHttpRequest: async function(id) {
    window.staticType(id, [Number]);
    let self = this;
    try {
      let menuHttp = new MenuHttpRequest();
      let resData = await menuHttp.deleteMenu([id]);
      swalSuccess(gettext("Les données ont été supprimées"));
      return resData;
    } catch (ex) {
      console.error("saveHttpRequest - ex ", ex);
      ex = ex.data.responseJSON;
      swalFailure(gettext("Échec de l'ajout du menu"), ex.return.message);
    }
  },
  saveHttpRequest: async function(props) {
    window.staticType(props, [Object]);
    let self = this;
    try {
      let menuHttp = new MenuHttpRequest();
      let resData = await menuHttp.addMenu(props);
      return resData;
    } catch (ex) {
      console.error("saveHttpRequest - ex ", ex);
      swalFailure(
        gettext("Échec de l'ajout du menu"),
        gettext("Des données ont été saisies")
      );
    }
  },
  updateHttpRequest: async function() {
    let self = this;
    try {
      let menuHttp = new MenuHttpRequest();
      let resData = await menuHttp.updateMenu(self.get("form_data"));
      switch (resData.status) {
        case "error":
          resData = resData.data.responseJSON;
          return swalFailure(
            gettext("La mise à jour du stock a échoué"),
            resData.return.message
          );
      }
      swalSuccess(
        gettext("Mettre à jour le succès du stock"),
        "",
        async function() {
          self.set("form_data", {});
          self.oncomplete();
        }
      );
    } catch (ex) {
      console.error("ex => ", ex);
    }
  },
  getMenu: async function(id) {
    window.staticType(id, [Number, String]);
    let self = this;
    try {
      let menuHttp = new MenuHttpRequest();
      let resData = await menuHttp.getMenu(id);
      return resData;
    } catch (ex) {
      console.error("ex -> ", ex);
    }
  },
  setMenu: async function(props) {
    window.staticType(props, [Object]);
    let self = this;
    switch (props.action) {
      case "error":
        return console.error("setMenu - error ", props);
    }
    await self.set("form_data", props.return);
    // Initialize plats dropdown
    self.selectDropdown = self.findComponentByRef("option_plats_menus");
    self.selectDropdown.setOnChangeListener(async function(props, e) {
      self.setUpdate("form_data", {
        plats_id: props.value
      });
    });
    self.selectDropdown.setValue(self.get("form_data").plats_id);
    // Initialize action dropdown
    self.selectAction = self.findComponentByRef("action");
    self.selectAction.setOnChangeListener(async function(props) {
      self.setUpdate("form_data", {
        action: props.value
      });
    });
    // Initialize form_Data to dom
    var form_data = self.get("form_data");
    var parent = $(`#form-update-${self.get("bus_param_id")}`);
    for (var key in form_data) {
      switch (key) {
        default:
          setTimeout(
            function(key) {
              parent.find(`input[name=${key}]`).val(form_data[key]);
            }.bind(this, key),
            100
          );
          break;
      }
    }
    // Initialize initTextValidation
    self.initTextValidation();
  }
});

export default FoodMenus;