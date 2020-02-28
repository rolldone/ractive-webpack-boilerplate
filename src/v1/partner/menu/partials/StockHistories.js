import ListGrid from '@v1/components/ListGrid';
import template from './views/StockHistoriesView.html';
import StockMenuHttpRequest from '../../services/StockMenuHttpRequest';

const StockHistories = ListGrid.extend({
  template,
  data: function() {
    return {
      menus_id: null
    };
  },
  onconfig: function() {},
  oncomplete: function() {},
  getDatas: async function() {
    let self = this;
    try {
      let stockMenuHttp = new StockMenuHttpRequest();
      let resData = await stockMenuHttp.getStockMenus(self.get("menus_id"));
      return resData;
    } catch (ex) {
      console.error("getDatas - ex ", ex);
    }
  },
  setDatas: function(props) {
    window.staticType(props, [Object]);
    let self = this;
    switch (props.status) {
      case "error":
        return console.error("setDatas - ex ", props);
    }
    console.log("setDatas ", props.return);
    self.set("datas", props.return);
  },
  findRecordHistory: async function(menus_id) {
    window.staticType(menus_id, [Number]);
    let self = this;
    try {
      await self.set("menus_id", menus_id);
      let resData = await self.getDatas();
      self.setDatas(resData);
    } catch (ex) {
      console.error("findRecordHistory - ex ", ex);
    }
  }
});

export default StockHistories;
