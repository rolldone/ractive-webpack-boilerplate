module.exports = function(router){
	router.addRoute('/user/users', function(){
		return new Promise(function(resolve){
			require.ensure([],function(){
				var Users = require('./Users');
				resolve(Users.default);
			})
		})
	},{
		middleware : [],
		name : 'user.users'
	});

	router.addRoute('/user/:id/view',function(){
		return new Promise(function(resolve){
			require.ensure([],function(){
				var User = require('./UserUpdate');
				resolve(User.default);
			})
		})
	},{
		middleware : [],
		name : 'user.view'
	})
		
	router.addRoute('/user/new',function(){
		return new Promise(function(resolve){
			require.ensure([],function(){
				var User = require('./UserNew');
				resolve(User.default);
			})
		})
	},{
		middleware : [],
		name : 'user.new'
	})
}