module.exports = function(router){
  router.addRoute('privilege/privileges',function(){
    return new Promise(function(resolve){
      require.ensure([],()=>{
        resolve(require('./Privileges').default);
      })
    })
  },{
    name : 'privilege.privileges'
  })
  
  router.addRoute('privilege/new',function(){
    return new Promise(function(resolve){
      require.ensure([],()=>{
        resolve(require('./PrivilegeNew').default);
      })
    })
  },{
    name : 'privilege.new'
  })

  router.addRoute('privilege/:id/view',function(){
    return new Promise(function(resolve){
      require.ensure([],()=>{
        resolve(require('./PrivilegeUpdate').default);
      })
    })
  },{
    name : 'privilege.view'
  })
}