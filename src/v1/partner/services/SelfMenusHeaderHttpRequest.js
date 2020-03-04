import MenusHeaderHttpRequest from "./MenusHeaderHttpRequest";

const SelfMenusHeaderHttpRequest = function() {
  return (new MenusHeaderHttpRequest()).extend({
    duplicateMenusHeader: async function(id) {
      return this.super.duplicateMenusHeader(id, window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_DUPLICATE);
    },
    getMenusHeader: async function(id) {
      return this.super.getMenusHeader(id, window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_VIEW);
    },
    getMenusHeaders: async function(props) {
      return this.super.getMenusHeader(props, window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_MENU_HEADERS);
    },
    addMenusHeader: async function(props) {
      return this.super.addMenusHeader(props, window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_ADD);
    },
    updateMenusHeader: async function(props) {
      return this.super.updateMenusHeader(props, window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_UPDATE);
    },
    deleteMenuHeader: async function(ids) {
      return this.super.deleteMenuHeader(ids, window.HTTP_REQUEST.MENU_HEADER_XHR.SELF_DELETE);
    }
  });
};

export default SelfMenusHeaderHttpRequest;
