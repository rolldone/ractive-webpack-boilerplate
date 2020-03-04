import '../assets/v2/css/style.scss';
import '../assets/ionicons/dist/scss/ionicons.scss';
const feather = require('feather-icons');
import Router from '../lib/ractive/RactiveRouter';
import '../lib/ractive/components.js';
import '../base/BaseCommon.js';
import '../assets/semantic/dist/semantic.min.css';
import '../assets/semantic/dist/semantic.min.js';

const router = new Router({
	el: '#main',
	basePath: '/v2/partner',
	data() {
		return {};
	},
});

router.addRoute('/dashboard', function () {
	return new Promise(function (resolve) {
		require.ensure([], function () {
			var Dashboard = require('./partner/dashboard/Dashboard.js');
			resolve(Dashboard.default);
		})
	})
}, {
	middleware: []
});

router.addRoute('/404', function () {
	return new Promise(function (resolve) {
		require.ensure([], function () {
			var page = require('./components/Page404.js');
			resolve(page.default);
		})
	})
}, {
	middleware: []
})

router.addRouteException(function (errorNumber) {
	switch (errorNumber) {
		case 404:
			router.dispatch('/member/404', {
				noHistory: false
			});
			break;
		case 301:
			break;
	}
})

/* Untuk Pertama Kali Loaded */
router.setOnInit(async function (next) {
	next(null);
});

/* Untuk Pertama Kali Loaded */
router.setOnComplete(function (next) {
	router
		.dispatch(window.location.pathname, {
			noHistory: true
		})
		.watchLinks()
		.watchState();
	next(null);
})

router.setOnBeforeEach([]);
router.setOnAfterEach([function (next) {
	feather.replace();
	$('.ui.dropdown').dropdown();
	next();
}]);

router.start();

window.router = router;

if (module.hot) {
	module.hot.accept();
}