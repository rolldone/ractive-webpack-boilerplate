module.exports = function(router){
  router.addRoute('setting/bus-param/bus-params',function(){
    return new Promise(function(resolve){
      require.ensure([],function(){
        resolve(require('./busparam/BusParams').default);
      })
    })
  },{
    name : 'setting.bus_param.bus_params'
  })
  router.addRoute('setting/bus-param/new',function(){
    return new Promise(function(resolve){
      require.ensure([],function(){
        resolve(require('./busparam/BusParamNew').default);
      })
    })
  },{
    name : 'setting.bus_param.new'
  })
  router.addRoute('setting/bus-param/:id/view',function(){
    return new Promise(function(resolve){
      require.ensure([],function(){
        resolve(require('./busparam/BusParamUpdate').default);
      })
    })
  },{
    name : 'setting.bus_param.view'
  })
}