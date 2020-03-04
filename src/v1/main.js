import Ractive from "BaseRactive";
import Router from "../lib/ractive/RactiveRouter";
import "../lib/ractive/components.js";
import "../assets/semantic/dist/semantic.min.css";
import "ionicons/dist/css/ionicons.css";
import "../assets/v1/css/backend.scss";
import "../assets/semantic/dist/semantic.min.js";
import "../base/BaseCommon.js";
import "../base/Swal.js";
import InitPubSub from "./middleware/InitPubSub";
import OnlyPartnerAccess from "./middleware/OnlyPartnerAccess";
import BaseHttpRequest from "./partner/services/BaseHttpRequest.js";
import PrivilegeHttpRequest from "./partner/services/PrivilegeHttpRequest";

Ractive.DEBUG = /unminified/.test(() => {
  /* unminified */
});

/* Ini Wajib ada untuk trigger load globalnya, kalo ini tidak di set Tidak jalan */
gettext("Salutations");

const router = new Router({
  el: "#main",
  basePath: "/member",
  data() {
    return {};
  }
});

router.addRoute(
  "/404",
  function() {
    return new Promise(function(resolve) {
      require.ensure([], function() {
        var page = require("./components/Page404.js");
        resolve(page.default);
      });
    });
  },
  {
    middleware: []
  }
);

router.addRouteException(function(errorNumber) {
  switch (errorNumber) {
    case 404:
      router.dispatch("/member/404", {
        noHistory: false
      });
      break;
    case 301:
      break;
  }
});

require("./partner/user/route.js")(router);
require("./partner/cuisine/route.js")(router);
require("./partner/product/route.js")(router);
require("./partner/menu/route.js")(router);
require('./partner/privilege/route.js')(router);
require('./partner/setting/route.js')(router);
require('./partner/supplier/route.js')(router);
require('./partner/cuisiner/route')(router);
require('./partner/subscribe/route')(router);
require('./partner/order/route')(router);
require('./partner/ingredient/route')(router);

/* Untuk Pertama Kali Loaded */
router.setOnInit(async function(next) {
  try {
    let httpRequest = new BaseHttpRequest();
    let resData = await httpRequest.getApiRoute();
    console.log("resssdata", resData);
    httpRequest.setApiRoute(resData.return);
    httpRequest = new PrivilegeHttpRequest();
    resData = await httpRequest.getSelfPrivilege();
    httpRequest.setSelfPrivilege(resData.return);
    next(null);
  } catch (ex) {
    console.error('setOnInit -> ',ex);
    window.location.href = "/auth/login";
  }
});

/* Untuk Pertama Kali Loaded */
router.setOnComplete(function(next) {
  router
    .dispatch(window.location.pathname, {
      noHistory: true
    })
    /* Ini untuk selalu listen a href */
    // .watchLinks()
    /* Ini penting untuk menjaga historynya  */
    .watchState();
  next(null);
});

router.setOnBeforeEach([OnlyPartnerAccess, InitPubSub]);
router.setOnAfterEach([
  function(next) {
    feather.replace();
    next();
  }
]);

router.start();

window.router = router;

if (module.hot) {
  module.hot.accept();
}
