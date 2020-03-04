module.exports = function(router){
  router.addRoute('/supplier/suppliers',function(){
    return new Promise(function(resolve){
      require.ensure([],function(){
        resolve(require('./Suppliers').default);
      })
    })
  },{
    name : 'supplier.suppliers'
  })
  router.addRoute('/supplier/new',function(){
    return new Promise((resolve)=>{
      require.ensure([],()=>{
        resolve(require('./SupplierNew').default);
      })
    })
  },{
    name : 'supplier.new'
  })
  router.addRoute('/supplier/:id/view',function(){
    return new Promise((resolve)=>{
      require.ensure([],()=>{
        resolve(require('./SupplierUpdate').default);
      })
    })
  },{
    name : 'supplier.view'
  })
  router.addRoute('/supplier/:id/duplicate',function(){
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./SupplierNewCopy').default));
    })
  },{
    name : 'supplier.duplicate'
  })
}