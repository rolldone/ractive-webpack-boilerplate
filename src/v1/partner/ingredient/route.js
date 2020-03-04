module.exports = function(router){
  router.addRoute('/ingredient/ingredients',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./IngredientList').default));
    })
  },{
    name : 'ingredient.ingredients'
  })
  router.addRoute('/ingredient/new',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./IngredientNew').default));
    })
  },{
    name : 'ingredient.new'
  })
  router.addRoute('/ingredient/:id/view',()=>{
    return new Promise((resolve)=>{
      require.ensure([],()=>resolve(require('./IngredientUpdate').default));
    })
  },{
    name : 'ingredient.view'
  })
}