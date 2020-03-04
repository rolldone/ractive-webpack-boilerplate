import Ractive from "ractive";
import config from "@config";

var BaseRactive = Ractive.extend({
  data: function() {
    return {
      take: 50,
      page: 1,
      start: 0,
      end: 0,
      limit_number: 5,
      pagination_numbers: []
    };
  },
  onconstruct : function(){
    this._super();
    this.reInitializeObserve();
  },
  reInitializeObserve: function() {
    let self = this;
    for (var key in self.newOn) {
      self.off(key);
      self.on(key, self.newOn[key]);
    }
  },
  /* 
	set : function(key,val){
		let self = this;
		self.data_key = key;
		return self._super(key,val);
	},
	 */
  findComponentByRef: function(ref) {
    window.staticType(ref, [String]);
    return componentsHash[ref];
  },
  validURL: function(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  },
  safeJSON: function(props, endpoint, index) {
    endpoint = endpoint.split(".");
    if (endpoint.length == 0) {
      return "";
    }
    if (index == null) {
      index = 0;
    }
    if (props == null) {
      return "";
    }
    if (props[endpoint[index]] == null) {
      return "";
    }
    props = props[endpoint[index]];
    index += 1;
    if (index == endpoint.length) {
      return props;
    }
    return this.safeJSON(props, endpoint.join("."), index);
  },
  removePropertyByPrefix: function(key, props) {
    let newProps = props;
    for (var a in newProps) {
      if (a.includes(key) == true) {
        delete newProps[a];
      }
    }
    return newProps;
  },
  mergeObjectAndFormData: function(props, domFormElement) {
    let formData = new FormData(domFormElement);
    let result = {};
    for (var entry of formData.entries()) {
      result[entry[0]] = entry[1];
    }
    props = Object.assign(result, props);
    return props;
  },
  objectToFormData: function(props) {
    let formData = null;
    formData = new FormData();
    for (var a in props) {
      if (props[a] != null) {
        formData.append(a, props[a]);
      }
    }
    return formData;
  },
  removePrefix: function(key, props) {
    for (var a in props) {
      if (props[a] != "") {
        let val = props[a];
        delete props[a];
        a = a.replace(key, "");
        props[a] = val;
      } else {
        delete props[a];
      }
    }
    return props;
  },
  getValuePrefix: function(key, props) {
    let theValue = {};
    for (var a in props) {
      if (a.includes(key) == true) {
        theValue[a] = props[a];
      }
    }
    return theValue;
  },
  getExistValue: function(whatNumber, arrayStoreNumber) {
    let isGot = false;
    for (let i = 0; i < arrayStoreNumber.length; i++) {
      if (arrayStoreNumber[i] == whatNumber) {
        isGot = true;
        break;
      }
    }
    if (isGot) {
      return true;
    }
    return false;
  },
  toEndSCroll: function(callback) {
    let self = this;
    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
        // $(window).unbind('scroll');
        if (self.pendingDebounce != null) {
          self.pendingDebounce.cancel();
        }
        self.pendingDebounce = _.debounce(function() {
          callback();
        }, 500);
        self.pendingDebounce();
      }
    });
  },
  setUrl: function(urlString, array) {
    for (var a = 0; a < array.length; a++) {
      for (var key in array[a]) {
        if (urlString.match(re)) {
          var re = new RegExp(key, "g");
          urlString = urlString.replace(re, array[a][key]);
        }
        break;
      }
    }
    return urlString;
  },
  getData: function(url, queryString) {
    let theArg = new Arg(url);
    let query = theArg.query();
    query = Object.assign(query, queryString);
    let theUrl = theArg.url(url, query);
    return new Promise(function(resolve) {
      $.ajax({
        method: "GET",
        url: theUrl,
        processData: false,
        contentType: false // what type of data do we expect back from the server
      })
        .then(function(res) {
          resolve(res);
        })
        .fail(function(data, status) {
          resolve({
            status: "error",
            data: data
          });
        });
    });
  },
  postData: function(url, formData) {
    return new Promise(function(resolve) {
      $.ajax({
        method: "POST",
        url: url,
        data: formData,
        processData: false,
        contentType: false // what type of data do we expect back from the server
      })
        .then(function(res) {
          resolve(res);
        })
        .fail(function(data, status) {
          resolve({
            status: "error",
            data: data
          });
        });
    });
  },
  setUpdate: function(key, props) {
    let self = this;
    return new Promise(function(resolve) {
      let currentData = self.get(key) || {};
      console.log("currentData -> ", currentData);
      self.set(key, Object.assign(currentData, props)).then(function() {
        resolve();
      });
    });
  },
  /*
			Ini untuk add dan append tanpa duplicate data
	*/
  initSelectedData: function(whatId, theArray) {
    let theSelectedData = theArray;
    let is_same = false;
    theSelectedData.forEach(function(item, i) {
      if (item == whatId) {
        is_same = true;
        theSelectedData.splice(i, 1);
      } else {
      }
    });
    if (!is_same) {
      theSelectedData.push(whatId);
    }
    return theSelectedData;
  },
  /*
			Ini untuk type key object lebih bagus dari initSelectedData
	*/
  initSelectedDataKey: function(whatId, theObject, isChecked = false) {
    let theSelectedData = theObject;
    if (theSelectedData[whatId] == null) {
      if (isChecked == true) {
        theSelectedData[whatId] = whatId;
      }
      return theSelectedData;
    }
    if (isChecked == false) {
      delete theSelectedData[whatId];
    }
    return theSelectedData;
  },
  initGlobally: function() {},
  submitValidation: function(props, callback) {
    let self = this;
    self.isPending = _.debounce(function(form_data) {
      let validation = new Validator(form_data, props.form_rules);
      validation.passes(function() {
        callback({
          status: "complete",
          form_data: form_data,
          error: {}
        });
      });
      validation.fails(function() {
        let newError = {};
        for (var aa in form_data) {
          switch (form_data[aa]) {
            case "":
            case null:
              delete form_data[aa];
              break;
          }
        }
        if (validation.errors.errors != null) {
          for (let key in validation.errors.errors) {
            newError[key] = validation.errors.errors[key][0];
            delete form_data[key];
          }
          callback({
            status: "error",
            form_data: form_data,
            error: newError
          });
        } else {
          callback({
            status: "valid",
            form_data: form_data,
            error: newError
          });
        }
      });
    }, 500);
    self.isPending(props.form_data);
  },
  inputTextValidation: function(wrapperTarget, props, callback) {
    let self = this;
    console.log("props.form_data", props.form_data);
    let theDom = $(wrapperTarget);
    theDom = theDom.find(props.element_target);
    theDom.each(function(index, dom) {
      $(dom).on("focus change keyup blur keydown", function(e) {
        if (self.isPending != null) {
          if (e.type != "blur") {
            self.isPending.cancel();
          }
        }
        self.isPending = _.debounce(function(key, value) {
          let newObject = {};
          newObject[key] = value;
          props.form_data = _.assign({}, props.form_data, newObject);
          for (var aa in props.form_data) {
            if (props.form_data[aa] == null || props.form_data[aa] == "") {
              delete props.form_data[aa];
            }
            if (aa == "") {
              delete props.form_data[aa];
            }
          }
          let validation = new Validator(props.form_data, props.form_rules);
          validation.passes(function() {
            callback(
              {
                status: "complete",
                form_data: props.form_data,
                error: {},
                message: ""
              },
              e
            );
          });
          validation.fails(function() {
            let newError = {};
            if (validation.errors.errors[key]) {
              newError[key] = validation.errors.errors[key][0];
              callback(
                {
                  status: "error",
                  form_data: props.form_data,
                  error: newError,
                  message: validation.errors.errors[key][0]
                },
                e
              );
            } else {
              callback(
                {
                  status: "valid",
                  form_data: props.form_data,
                  error: newError,
                  message: ""
                },
                e
              );
            }
          });
        }, 300);
        self.isPending(e.target.name, e.target.value);
      });
    });
  },
  setTitle: function(whatTitle) {
    this.root.findComponent("head-menu").setHeader("page_name", whatTitle);
  },
  show: function() {
    alert("need to overriding");
  },
  hide: function() {
    alert("need to overriding");
  },
  jsonParseUrl: function(whatUrl) {
    let theUrl = new Arg(whatUrl);
    let theJSON = {};
    theJSON["query"] = theUrl.query();
    theJSON["hash"] = theUrl.hash();
    return theJSON;
  },
  jsonToQueryUrl: function(url, whatObject, action) {
    let theArg = new Arg();
    if (action == "hash") {
      theArg.urlUseHash = true;
    }
    let theUrl = theArg.url(url, whatObject);
    return theUrl;
  },
  updateUrlState: function(curUrl, action) {
    // console.log(window.location.href,' - '+curUrl);
    switch (action) {
      case "PUSH_STATE":
        if (window.location.href == curUrl) {
          return;
        }
        return window.history.pushState(curUrl, {
          noHistory: false
        });
    }
    // window.router.update(curUrl,false,{});
  },
  /* 
			Ini cocok untuk ketika data di salah satu pagination 
		 	number result empty maka lakukan recheck limit pagination kembali
		 	dengan yang baru 
	*/
  recheckPaginationAfterEmpty: async function(lastPage) {
    let self = this;
    if (lastPage == 0) {
      return;
    }
    await self.set("page", lastPage);
    await self.set("limit_number", lastPage);
    let newUrlState = self.jsonToQueryUrl(
      window.location.href,
      {
        page: self.get("page")
      },
      null
    );
    self.updateUrlState(newUrlState);
    self.initPagination();
    self.set("update_state", new Date());
  },
  /*
			Jangan selalu Dipanggil pada saat http request data,
			jelek hasilnya, coba aja sendiri
	*/
  getPaginationNumbers: function(take, page, is_change, is_update_url) {
    let self = this;
    return new Promise(function(resolve) {
      try {
        /** Define pushstate url first time **/
        if (is_update_url == null || is_update_url == true) {
          let newQuery = {
            page: page,
            take: take
          };
          let curUrl = Arg(window.location.href);
          newQuery = Object.assign(curUrl.query(), newQuery);
          curUrl = Arg().url(window.location.href, newQuery);
          console.log("curUrl", curUrl);
          self.updateUrlState(curUrl);
        }
        /** Will process pagination **/
        switch (is_change) {
          case false:
            /** If getting false prevent this action **/
            self.set("page", page);
            return resolve();
          case true:
            self.set("page", page);
            break;
        }
        let limitNumber = self.get("limit_number") || 5;
        let start = page - parseInt(limitNumber / 2);
        console.log("start", start);
        if (start <= 1) {
          start = 1;
        }
        let end = page + limitNumber;
        let thePaginationNumbers = [];
        let lengthNumber = 0;
        for (var a = start; a < end; a++) {
          thePaginationNumbers.push(a);
          lengthNumber += 1;
        }
        self.set("pagination_numbers", thePaginationNumbers).then(function() {
          resolve();
        });
      } catch (ex) {
        console.error("getPaginationNumbers - ex ", ex);
        resolve();
      }
    });
  },
  waitingDOMLoaded: function(selector, callback) {
    let self = this;
    if ($(selector).length) {
      setTimeout(function() {
        callback();
      }, 1000);
    } else {
      setTimeout(function() {
        self.waitingDOMLoaded(selector, callback);
      }, 1000);
    }
  },
  waitingTimeout: function(whatSecondTime) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, whatSecondTime);
    });
  },
  handleCaptchaListener: function(dom_id, callback) {
    let self = this;
    window.staticType(dom_id, [String]);
    window.staticType(callback, [Function]);
    try {
      self.grecaptcha = grecaptcha.render(dom_id, {
        sitekey: config.g_captcha_site_key,
        callback: function(response) {
          return callback(response);
          self.setUpdate("form_data", {
            recaptcha_token: response
          });
        }
      });
    } catch (ex) {
      alert(ex.message);
    }
  },
  url: function(stringUrl) {
    let self = this;
    window.staticType(stringUrl, [String]);
    if (self.validURL(stringUrl) == true) {
      return stringUrl;
    }
    return config.BASE_PATH + stringUrl;
  },
  staticAsset: function(stringUrl) {
    window.staticType(stringUrl, [String]);
    return config.ASSET + stringUrl;
  },
  assetApiUrl : function(stringUrl){
    window.staticType(stringUrl,[String]);
    return config.API_ASSET_URL + stringUrl;
  },
  dispatch: function(stringUrlOrName, props = null) {
    if (this.routeName(stringUrlOrName) != "") {
      stringUrlOrName = this.routeName(stringUrlOrName);
    }
    if (props != null) {
      var whattheUrl = stringUrlOrName;
      if (props.state != null) whattheUrl = this.setUrl(whattheUrl, [props.state]);
      if (props.query != null) whattheUrl = this.jsonToQueryUrl(whattheUrl, props.query, null);
      if (props.hash != null) whattheUrl = this.jsonToQueryUrl(whattheUrl, props.hash, "hash");
      stringUrlOrName = whattheUrl;
    }
    window.router.dispatch(stringUrlOrName, {
      noHistory: false
    });
  },
  routeName: function(whatRouteName,props=null) {
    if(props != null){
      var whattheUrl = window.router.routeName(whatRouteName)
      if (props.state != null) whattheUrl = this.setUrl(whattheUrl, [props.state]);
      if (props.query != null) whattheUrl = this.jsonToQueryUrl(whattheUrl, props.query, null);
      if (props.hash != null) whattheUrl = this.jsonToQueryUrl(whattheUrl, props.hash, "hash");
      return whattheUrl;
    }
    return window.router.routeName(whatRouteName);
  },
  getConfig : function(){
    return config;
  },
  newOn: {}
});

export default BaseRactive;
