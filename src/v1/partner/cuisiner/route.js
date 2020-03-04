module.exports = function(router){
  router.addRoute('/cuisiner/cuisiners',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./Cuisiners').default));
    })
  },{
    name : 'cuisiner.cuisiners'
  })
  router.addRoute('/cuisiner/new',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./CuisinerNew').default));
    })
  },{
    name : 'cuisiner.new'
  })
  router.addRoute('/cuisiner/:id/view',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./CuisinerUpdate').default));
    })
  },{
    name : 'cuisiner.view'
  })
}