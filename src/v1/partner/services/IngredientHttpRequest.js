import BaseHttpRequest from "./BaseHttpRequest";

export default function() {
  return new BaseHttpRequest().extend({
    getIngredients: async function(props = {}) {
      window.staticType(props, [Object, null]);
      try {
        let resdata = await this.getData(window.HTTP_REQUEST.INGREDIENT_XHR.INGREDIENTS, props);
        if (resdata.status == "error") throw resdata.data.responseJSON;
        return resdata;
      } catch (ex) {
        throw ex;
      }
    },
    getIngredient: async function(id) {
      window.staticType(id, [Number, String]);
      try {
        let resdata = await this.getData(this.setUrl(window.HTTP_REQUEST.INGREDIENT_XHR.VIEW, [{ "{id}": id }]));
        if (resdata.status == "error") throw resdata.data.responseJSON;
        return resdata;
      } catch (ex) {
        throw ex;
      }
    },
    addIngredient: async function(props = {}) {
      window.staticType(props, [Object]);
      try {
        let formData = this.objectToFormData(props);
        let resdata = await this.postData(window.HTTP_REQUEST.INGREDIENT_XHR.ADD, formData);
        if (resdata.status == "error") throw resdata.data.responseJSON;
        return resdata;
      } catch (ex) {
        throw ex;
      }
    },
    updateIngredient: async function(props = {}) {
      window.staticType(props, [Object]);
      try {
        let formData = this.objectToFormData(props);
        let resdata = await this.postData(window.HTTP_REQUEST.INGREDIENT_XHR.UPDATE, formData);
        if (resdata.status == "error") throw resdata.data.responseJSON;
        return resdata;
      } catch (ex) {
        throw ex;
      }
    },
    deleteIngredient: async function(ids) {
      window.staticType(ids, [Array]);
      try {
        let formData = this.objectToFormData({
          ids: JSON.stringify(ids)
        });
        let resdata = await this.postData(window.HTTP_REQUEST.INGREDIENT_XHR.DELETE, formData);
        if (resdata.status == "error") throw resdata.data.responseJSON;
        return resdata;
      } catch (ex) {
        throw ex;
      }
    },
    getUnitOfMeasure: async function() {
      try {
        let resdata = await this.getData(window.HTTP_REQUEST.INGREDIENT_XHR.UNIT_OF_MEASURE);
        if (resdata.status == "error") throw resdata.data.responseJSON;
        return resdata;
      } catch (ex) {
        throw ex;
      }
    }
  });
}
