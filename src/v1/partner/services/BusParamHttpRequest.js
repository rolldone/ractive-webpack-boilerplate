import BaseHttpRequest from "./BaseHttpRequest";

var BusParamHttpRequest = function() {
  let self = new BaseHttpRequest().extend();
  self.getBussineParameterStaticCategory = async function() {
    try {
      let url = window.HTTP_REQUEST.BUS_PARAM_CAT_XHR.BUS_PARAM_CATS;
      let resdata = await self.getData(url, {});
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.getBussineParameterByCategory = async function(whatTypeCategory) {
    try {
      let url = window.HTTP_REQUEST.BUS_PARAM_XHR.BUS_PARAMS;
      let resdata = await self.getData(url, {
        category_name: whatTypeCategory
      });
      return resdata;
    } catch (ex) {
      throw ex;
    }
  };
  self.viewBussineParameter = async function() {};
  self.addBussineParameter = async function() {};
  self.updateBussineParameter = async function() {};
  self.deleteBussineParameter = async function() {};
  return self;
};

export default BusParamHttpRequest;