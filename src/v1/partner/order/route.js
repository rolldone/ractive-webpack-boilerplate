module.exports = function(router){
  router.addRoute('/order/orders',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./OrdersSelf').default));
    })
  },{
    name : 'order.self.orders'
  })
  router.addRoute('/order/orders',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./OrderDetailSelf').default));
    })
  },{
    name : 'order.self.view'
  })
  router.addRoute('/order/orders',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./Orders').default));
    })
  },{
    name : 'order.orders'
  })
  router.addRoute('/order/:id/detail',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./OrderDetail').default));
    })
  },{
    name : 'order.detail'
  })
}