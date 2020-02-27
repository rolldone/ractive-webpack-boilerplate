module.exports = function(router){
    router.addRoute('/cuisine/cuisines',function(){
        return new Promise(function(resolve){
            require.ensure([],function(){
                resolve(require('./Cuisines').default)
            });
        })
    },{
        name : 'cuisine.cuisines'
    });
    router.addRoute('/cuisine/new',function(){
        return new Promise((resolve)=>{
            require.ensure([],function(){
                resolve(require('./CuisineNew').default);
            })
        })
    },{
        name : 'cuisine.new'
    })
    router.addRoute('/cuisine/:id/view',function(){
        return new Promise((resolve)=>{
            require.ensure([],function(){
                resolve(require('./CuisineUpdate').default);
            })
        })
    },{
        name : 'cuisine.view'
    })
    router.addRoute('/cuisine/duplicate/:id',function(){
        return new Promise((resolve)=>{
            require.ensure([],function(){
                resolve(require('./CuisineNewCopy').default);
            })
        })
    },{
        name : 'cuisine.duplicate'
    })
    router.addRoute('/cuisine/self',function(){
        return new Promise((resolve)=>{
            require.ensure([],function(){
                resolve(require('./CuisineSelf').default);
            })
        })
    },{
        name : 'cuisine.self.view'
    })
}