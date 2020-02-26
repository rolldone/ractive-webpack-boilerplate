const feather = require('feather-icons');
import Ractive from 'BaseRactive';
import Router from '../lib/ractive/RactiveRouter';
import '../lib/ractive/components.js';
import '../assets/semantic/dist/semantic.min.css';
import '../assets/ionicons/dist/scss/ionicons.scss';
import '../assets/v1/css/backend.scss';
import '../assets/semantic/dist/semantic.min.js';
import '../base/BaseCommon.js';
import '../base/swal.js';
import InitPubSub from './middleware/InitPubSub';
import BaseHttpRequest from './partner/services/BaseHttpRequest.js';
import PrivilegeHttpRequest from './partner/services/PrivilegeHttpRequest';

Ractive.DEBUG = /unminified/.test(() => { /* unminified */ });

/* Ini Wajib ada untuk trigger load globalnya, kalo ini tidak di set Tidak jalan */
gettext('Salutations');

const router = new Router({
  el: '#main',
  basePath: '/member',
  data() {
    return {};
  },
});

router.addRoute('/user/users', function(){
  return new Promise(function(resolve){
    require.ensure([],function(){
      var Users = require('./partner/user/Users');
      resolve(Users.default);
    })
  })
},{
  middleware : []
});

router.addRoute('/user/new',function(){
  return new Promise(function(resolve){
    require.ensure([],function(){
      var User = require('./partner/user/UserNew');
      resolve(User.default);
    })
  })
},{
  middleware : []
})

router.addRoute('/user/:id/view',function(){
  return new Promise(function(resolve){
    require.ensure([],function(){
      var User = require('./partner/user/UserUpdate');
      resolve(User.default);
    })
  })
},{
  middleware : []
})

router.addRoute('/404',function(){
  return new Promise(function(resolve){
    require.ensure([],function(){
      var page = require('./components/Page404.js');
      resolve(page.default);
    })
  })
},{
  middleware : []
})


router.addRouteException(function(errorNumber){
  switch(errorNumber){
      case 404:
          router.dispatch('/member/404',{
            noHistory : false
          });
          break;
      case 301:
          break;
  }
})

/* Untuk Pertama Kali Loaded */
router.setOnInit(async function(next){
  let httpRequest = new BaseHttpRequest();
  let resData = await httpRequest.getApiRoute();
  httpRequest.setApiRoute(resData.return);
  httpRequest = new PrivilegeHttpRequest();
  resData = await httpRequest.getSelfPrivilege();
  httpRequest.setSelfPrivilege(resData.return);
  next(null);
});

/* Untuk Pertama Kali Loaded */
router.setOnComplete(function(next){
  router
    .dispatch(window.location.pathname, {
      noHistory : true
    })
    .watchLinks()
    .watchState();
  next(null);
})

router.setOnBeforeEach([InitPubSub]);
router.setOnAfterEach([function(next){
  feather.replace();
  next();
}]);

router.start();

window.router = router;

if (module.hot) {
  module.hot.accept();
}
