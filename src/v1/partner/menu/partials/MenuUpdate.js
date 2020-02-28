import MenuNew from "./MenuNew";
import FoodMenus from "./FoodMenus";
import BusParamHttpRequest from "../../services/BusParamHttpRequest";

const MenuUpdate = MenuNew.extend({
  components: {
    "food-menus": FoodMenus
  },
  data: function() {
    return {
      old_form_data: {}
    };
  },
  oncomplete: function() {
    let self = this;
    self._super();
    return new Promise(async function(resolve) {
      let resData = await self.getMenuHeader();
      self.setMenuHeader(resData);
      resData = await self.getMenuDatas();
      self.setMenuDatas(resData);
    });
  },
  getMenuHeader: async function() {
    let self = this;
    try {
      let menuHeaderHttp = self.returnNewMenusHeaderHttpRequest();
      let resData = await menuHeaderHttp.getMenusHeader(self.root.get("id"));
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  setMenuHeader: async function(props) {
    let self = this;
    switch (props.action) {
      case "error":
        return console.error("setMenuHeader - ex ", ex);
    }
    await self.set("form_data", props.return);
    await self.set("old_form_data", props.return);
    console.log("sefl.dateCalendar", self.dateCalendar.daterangepicker);
    self.dateCalendar.data("daterangepicker").setStartDate(moment(self.get("form_data").date, "YYYY-MM-DD"));
    console.log("old", self.get("old_form_data"));
    console.log("current", self.get("form_data"));
  },
  getMenuDatas: async function() {
    let self = this;
    try {
      let busParamHttpRequest = new BusParamHttpRequest();
      let resData = await busParamHttpRequest.getBussineParameterByCategory("PLATS_CATEGORY");
      return resData;
    } catch (ex) {
      console.error("getMenuDatas - ex ", ex);
    }
  },
  setMenuDatas: async function(props) {
    let self = this;
    switch (props.action) {
      case "error":
        console.error("setMenuDatas - ex ", props);
        return;
    }
    await self.set("menu_datas", props.return);

    self.foodMenus = self.findAllComponents("food-menus");
    for (var i in self.foodMenus) {
      let foodMenu = self.foodMenus[i];
      foodMenu.setOnActionListener(function(action, props) {
        switch (action) {
          case "CONFIG":
            console.log(props);
            return;
        }
      });
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

export default MenuUpdate;
