import BaseHttpRequest from "../../../lib/BaseHttpRequest";
import config from "@config";

export default function() {
  return new BaseHttpRequest().extend({
    getApiRoute: async function() {
      try {
        let url = config.API_LIST;
        let resData = await this.getData(url, {
          version: ""
        });
        if (resData.status == "error") throw resData.data.responseJSON;
        return resData;
      } catch (ex) {
        console.error("getApiRoute - ex ", ex);
      }
    },
    setApiRoute: function(route) {
      route = this.super.setApiRoute(route);
      window.HTTP_REQUEST = Object.freeze({
        USER: {
          USERS: route["member.user.users"],
          VIEW: route["member.user.view"]
        },
        USER_XHR: {
          PROFILE: route["api.member.user.profile"],
          UPDATE_PROFILE: route["api.member.user.self.profile.update"],
          SELF_USERS: route["api.member.user.self.users"],
          SELF_VIEW: route["api.member.user.self.view"],
          SELF_ADD: route["api.member.user.self.add"],
          SELF_UPDATE: route["api.member.user.self.update"],
          SELF_DELETE: route["api.member.user.self.delete"],
          USERS: route["api.member.user.users"],
          UPDATE: route["api.member.user.update"],
          ADD: route["api.member.user.add"],
          VIEW: route["api.member.user.view"],
          DELETE: route["api.member.user.delete"]
        },
        MENU_HEADER: {
          MENU_HEADERS: route["member.menu.menus"],
          VIEW: route["member.menu.view"],
          NEW: route["member.menu.new"]
        },
        MENU_HEADER_XHR: {
          SELF_MENU_HEADERS: route["api.member.menu.menu_header.self.menu_headers"],
          SELF_VIEW: route["api.member.menu.menu_header.self.view"],
          SELF_ADD: route["api.member.menu.menu_header.self.new"],
          SELF_UPDATE: route["api.member.menu.menu_header.self.update"],
          SELF_DELETE: route["api.member.menu.menu_header.self.delete"],
          SELF_DUPLICATE: route["api.member.menu.menu_header.self.duplicate"],
          MENU_HEADERS: route["api.member.menu.menu_header.menu_headers"],
          VIEW: route["api.member.menu.menu_header.view"],
          ADD: route["api.member.menu.menu_header.new"],
          UPDATE: route["api.member.menu.menu_header.update"],
          DELETE: route["api.member.menu.menu_header.delete"],
          DUPLICATE: route["api.member.menu.menu_header.duplicate"]
        },
        MENU_XHR: {
          MENUS: route["api.member.menu.menus"],
          VIEW: route["api.member.menu.view"],
          ADD: route["api.member.menu.add"],
          UPDATE: route["api.member.menu.update"],
          DELETE: route["api.member.menu.delete"]
        },
        MENU_STOCK_XHR: {
          MENU_STOCKS: route["api.member.menu.stock_menu.stock_menus"],
          VIEW: route["api.member.menu.stock_menu.view"],
          NEW: route["api.member.menu.stock_menu.new"],
          UPDATE: route["api.member.menu.stock_menu.update"],
          DELETE: route["api.member.menu.stock_menu.delete"]
        },
        MENU_CUISINE_XHR: {
          MENU_CUISINES: route["api.member.menu.cuisine.menu_cuisines"],
          VIEW: route["api.member.menu.cuisine.view"],
          NEW: route["api.member.menu.cuisine.new"],
          UPDATE: route["api.member.menu.cuisine.update"],
          DELETE: route["api.member.menu.cuisine.delete"]
        },
        PRODUCT_XHR: {
          SELF_PRODUCTS: route["api.member.product.self.products"],
          SELF_VIEW: route["api.member.product.self.view"],
          SELF_ADD: route["api.member.product.self.add"],
          SELF_UPDATE: route["api.member.product.self.update"],
          SELF_DELETE: route["api.member.product.self.delete"],
          PRODUCTS: route["api.member.product.products"],
          VIEW: route["api.member.product.view_plat"],
          ADD: route["api.member.product.add"],
          UPDATE: route["api.member.product.update"],
          DELETE: route["api.member.product.delete"],
          PRODUCT_CUISINES: route["api.member.product.product_cuisines"],
          ADD_PRODUCT_CUISINE: route["api.member.product.product_cuisine.add"],
          DELETE_PRODUCT_CUISINE: route["api.member.product.product_cuisine.delete"]
        },
        BUS_PARAM_XHR: {
          BUS_PARAMS: route["api.member.bus_parameter.bus_parameters"],
          VIEW: route["api.member.bus_parameter.view_bus_parameter"],
          ADD: route["api.member.bus_parameter.add"],
          UPDATE: route["api.member.bus_parameter.update"],
          DELETE: route["api.member.bus_parameter.delete"]
        },
        BUS_PARAM_CAT_XHR: {
          BUS_PARAM_CATS: route["api.member.bus_parameter.cat.categories"]
        },
        PRODUCT: {
          VIEW: route["member.product.view"],
          DUPLICATE: route["member.product.duplicate"]
        },
        BUS_PARAM: {
          BUS_PARAMS: route["member.product.bus_params"],
          NEW: route["member.product.bus_param.new"],
          VIEW: route["member.product.bus_param.view"]
        },
        PRIVILEGE: {
          PRIVILEGES: route["member.privilege.privileges"],
          VIEW: route["member.privilege.view"]
        },
        PRIVILEGE_XHR: {
          BELOW_GROUP_ID: route["api.member.privilege.below_group_id"],
          PRIVILEGE_ITEMS: route["api.member.privilege.privilege_items"],
          PRIVILEGES: route["api.member.privilege.privileges"],
          VIEW: route["api.member.privilege.view"],
          UPDATE: route["api.member.privilege.update"],
          ADD: route["api.member.privilege.add"],
          DELETE: route["api.member.privilege.delete"],
          SELF_PRIVILEGE: route["api.member.privilege.self.privilege"]
        },
        CUISINER: {
          VIEW: route["member.cuisiner.view"]
        },
        CUISINE: {
          CUISINES: route["member.cuisine.cuisines"],
          NEW: route["member.cuisine.new"],
          VIEW: route["member.cuisine.view"],
          CUISINE_USERS: route["member.cuisine.cuisine_users"],
          DUPLICATE: route["member.cuisine.duplicate"]
        },
        CUISINER_XHR: {
          CUISINERS: route["api.member.cuisiner.cuisiners"],
          ADD: route["api.member.cuisiner.add"],
          UPDATE: route["api.member.cuisiner.update"],
          VIEW: route["api.member.cuisiner.view"],
          DELETE: route["api.member.cuisiner.delete"]
        },
        CUISINE_XHR: {
          SELF_CUISINE_USERS: route["api.member.cuisine.self.cuisine_users"],
          SELF_VIEW: route["api.member.cuisine.self.view"],
          SELF_UPDATE: route["api.member.cuisine.self.update"],
          SELF_ADD_CUISINE_USER: route["api.member.cuisine.self.cuisine_user.add"],
          SELF_DELETE_CUISINE_USER: route["api.member.cuisine.self.cuisine_user.delete"],
          CUISINES: route["api.member.cuisine.cuisines"],
          ADD: route["api.member.cuisine.new"],
          UPDATE: route["api.member.cuisine.update"],
          VIEW: route["api.member.cuisine.view"],
          DELETE: route["api.member.cuisine.delete"],
          CUISINE_USERS: route["api.member.cuisine.cuisine_users"],
          DELETE_CUISINE_USER: route["api.member.cuisine.cuisine_user.delete"],
          ADD_CUISINE_USER: route["api.member.cuisine.cuisine_user.add"]
        },
        SUPPLIER: {
          SUPPLIERS: route["member.supplier.suppliers"],
          NEW: route["member.supplier.new"],
          VIEW: route["member.supplier.view"],
          DUPLICATE: route["member.supplier.duplicate"]
        },
        SUPPLIER_XHR: {
          SUPPLIERS: route["api.member.supplier.suppliers"],
          ADD: route["api.member.supplier.new"],
          UPDATE: route["api.member.supplier.update"],
          VIEW: route["api.member.supplier.view"],
          DELETE: route["api.member.supplier.delete"]
        },
        SUBSCRIBE_XHR: {
          SUBSCRIBES: route["api.member.subscribe.subscribes"],
          VIEW: route["api.member.subscribe.view"],
          DELETE: route["api.member.subscribe.delete"]
        },
        INGREDIENT_XHR: {
          INGREDIENTS: route["api.member.ingredient.ingredients"],
          VIEW: route["api.member.ingredient.view"],
          ADD: route["api.member.ingredient.add"],
          UPDATE: route["api.member.ingredient.update"],
          DELETE: route["api.member.ingredient.delete"],
          UNIT_OF_MEASURE: route["api.member.ingredient.unit_of_measure"]
        }
      });
    }
  });
}
