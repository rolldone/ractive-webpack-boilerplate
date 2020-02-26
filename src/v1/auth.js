import Ractive from 'BaseRactive';
import Router from '../lib/ractive/RactiveRouter';
import '../lib/ractive/components.js';
import '../assets/semantic/dist/semantic.min.css';
import '../assets/semantic/dist/semantic.min.js';
import '../assets/v1/css/backend.scss';
import '../assets/v1/css/backend_auth.scss';
import '../base/BaseCommon.js';
import BaseHttpRequest from './auth/services/BaseHttpRequest.js';
import OnlyGuestAccess from './middleware/OnlyGuestAccess';

Ractive.DEBUG = /unminified/.test(() => { /* unminified */ });

/* Ini Wajib ada untuk trigger load globalnya, kalo ini tidak di set Tidak jalan */
gettext('Salutations');

const router = new Router({
  el: '#auth',
  basePath: '/auth',
  data() {
    return {};
  },
});
router.addRoute('/login',function(){
  return new Promise(function(resolve){
    require.ensure([],function(){
      var Login = require('./auth/login.js');
      resolve(Login.default);
    })
  })
},{
  middleware : []
})
router.addRoute('/register',function(){
  return new Promise(function(resolve){
    require.ensure([],function(){
      var Register = require('./auth/register.js');
      resolve(Register.default);
    })
  })
},{
  middleware : []
})
router.addRoute('/logout',function(){
  return new Promise(function(resolve){
    require.ensure([],function(){
      var Logout = require('./auth/Logout.js');
      resolve(Logout.default);
    })
  })
})

router.addRouteException(function(errorNumber){
    switch(errorNumber){
        case 404:
            break;
        case 301:
            break;
    }
})

/* Untuk Pertama Kali Loaded */
router.setOnInit(async function(callback){
  let httpRequest = new BaseHttpRequest();
  let resData = await httpRequest.getApiRoute();
  httpRequest.setApiRoute(resData.return);
  callback(null);
});

router.setOnBeforeEach([function(callback){
  callback(null);
}])


/* Untuk Pertama Kali Loaded */
router.setOnComplete(function(callback){
  router
    .dispatch(window.location.pathname, { noHistory: false })
    .watchLinks()
    .watchState();
  callback(null);
})

router.setOnBeforeEach([OnlyGuestAccess]);
router.setOnAfterEach([]);

router.start();

window.router = router;

if (module.hot) {
  module.hot.accept();
}
