import BaseRactive from "BaseRactive";
const feather = require("feather-icons");

/* Initialize feather icon */
window.feather = feather;

/* Import daterangepicker */
require("@app/assets/daterangepicker/dist/daterangepicker.css");
require("@app/assets/daterangepicker/dist/daterangepicker.min.js");

/* Ini Wajib ada untuk trigger load globalnya, kalo ini tidak di set Tidak jalan */
gettext("Salutations");

/* Load moment as global */
window.moment = moment;

/* Initialize BaseRactive Find Component as Ref */
window.componentsHash = {}; /* GLOBAL */
BaseRactive.defaults.oninit = function() {
  if (this.get("ref") != null) {
    componentsHash[this.get("ref")] = this;
  }
};
BaseRactive.defaults.onteardown = function() {
  if (this.get("ref") && window.componentsHash[this.get("ref")]) {
    delete window.componentsHash[this.get("ref")];
  }
};
BaseRactive.DEBUG = true; ///unminified/.test(() => { /* unminified */ });

window.routeName = function(router_store_list) {
  window.staticType(router_store_list, [Object]);
  return function(whatROuteName) {
    window.staticType(whatROuteName, [String]);
    if (router_store_list[whatROuteName] == null) return false;
    return true;
  };
};

/* Ini supaya loading spinnernya ilang. Defaultnya false */
NProgress.configure({ showSpinner: true });

/* Setup ajax */
document.cookie = "Bearer ";
$.ajaxSetup({
  headers: {
    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    Authorization: "Bearer " + window.localStorage.getItem("token")
  },
  cache: false,
  beforeSend: function(xhr) {
    /*NProgress.done();*/
    console.log("xhr", xhr);
    NProgress.set(0.5);
  },
  complete: function(xhr, status) {
    NProgress.done();
  }
});

/* Parse local storage to json */
var toJson = function(key) {
  var data = window.localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
};

/* Static Type check allowed type data */
window.staticType = function(inVariable, typeDatas = []) {
  var isWRong = true;
  var closureCondition = function(theVariable, arrayRecordTypeOf) {
    return function(typeDataItem) {
      switch (true) {
        case typeDataItem == Array:
          return Array.isArray(theVariable);
        case typeDataItem == undefined:
        case typeDataItem == null:
          if (theVariable == typeDataItem) {
            return true;
          }
          arrayRecordTypeOf.push(typeDataItem);
          return false;
        case typeof theVariable == typeDataItem.name.toLowerCase():
          return true;
        default:
          arrayRecordTypeOf.push(typeDataItem.name);
          return false;
      }
    };
  };
  var recordTypeOf = [];
  var doCheckStaticType = closureCondition(inVariable, (recordTypeOf = []));
  for (var a = 0; a < typeDatas.length; a++) {
    if (doCheckStaticType(typeDatas[a]) == true) {
      isWRong = false;
      break;
    }
  }
  if (isWRong == true) {
    var messageError = `value "${inVariable}" is Wrong type of variable, the requirement is ${JSON.stringify(
      recordTypeOf
    )}`;
    console.error("staticType - error ", messageError);
    throw new Error(messageError);
  }
};

/* Get each data on object */
window.eachObject = function(theOBject, callback, timeout = 100) {
  window.staticType(theOBject, [Object, Array]);
  window.staticType(callback, [Function]);
  window.staticType(timeout, [Number, null]);
  var index = 0;
  for (var key in theOBject) {
    setTimeout(
      function(i, key) {
        callback(i, key, theOBject[key]);
      }.bind(this, index, key),
      timeout
    );
    index += 1;
  }
};

/* Pusher setup */
window.pusher = new Pusher("", {
  cluster: "ap1",
  forceTLS: true
});
