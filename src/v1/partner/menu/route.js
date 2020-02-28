module.exports = function(router) {
  router.addRoute(
    "/menu/menus",
    function() {
      if (window.hasPermission("menu.self") == false) {
        return new Promise(function(resolve) {
          require.ensure([], function() {
            resolve(require("./Menus").default);
          });
        });
      }
      /* For self privilege */
      return new Promise(function(resolve) {
        require.ensure([], function() {
          require.ensure([], function() {
            resolve(require("./MenusSelf").default);
          });
        });
      });
    },
    {
      name: "menu.menus"
    }
  );
  router.addRoute(
    "/menu/new",
    function() {
      if (window.hasPermission("menu.self") == false) {
        return new Promise(function(resolve) {
          require.ensure([], function() {
            resolve(require("./MenuTabNew").default);
          });
        });
      }
      /* For self privilege */
      return new Promise(function(resolve) {
        require.ensure([], function() {
          resolve(require("./MenuTabSelfNew").default);
        });
      });
    },
    {
      name: "menu.new"
    }
  );
  router.addRoute(
    "/menu/:id/view",
    function() {
      if (window.hasPermission("menu.self") == false) {
        return new Promise(function(resolve) {
          require.ensure([], function() {
            resolve(require("./MenuTabUpdate").default);
          });
        });
      }
      /* For self privilege */
      return new Promise(function(resolve) {
        require.ensure([], function() {
          resolve(require("./MenuTabSelfUpdate").default);
        });
      });
    },
    {
      name: "menu.view"
    }
  );
};
