module.exports = function(router){
  router.addRoute('/subscribe/subscribes',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./Subscribes').default));
    })
  },{
    name : 'subscribe.subscribes'
  })
}