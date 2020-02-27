module.exports = function(router){
    /* General product */
    router.addRoute('/product/products',function(){
        if(window.hasPermission('product.self') == true){
            return new Promise(function(resolve){
                require.ensure([],function(){
                    resolve(require('./ProductsSelf').default);
                })
            })
        }
        return new Promise(function(resolve){
            require.ensure([],function(){
                resolve(require('./Products').default);
            })
        })
    },{
        name : 'product.products'
    })
    router.addRoute('/product/new',function(){
        if(window.hasPermission('product.self') == true){
            return new Promise(function(resolve){
                require.ensure([],function(){
                    resolve(require('./ProductTabSelfNew').default);
                })
            })
        }
        return new Promise(function(resolve){
            require.ensure([],function(){
                resolve(require('./ProductTabNew').default);
            })
        })
    },{
        name : 'product.new'
    })
    router.addRoute('/product/:id/view',function(){
        if(window.hasPermission('product.self') == true){
            return new Promise(function(resolve){
                require.ensure([],function(){
                    resolve(require('./ProductTabSelfUpdate').default);
                })
            })
        }
        return new Promise(function(resolve){
            require.ensure([],function(){
                resolve(require('./ProductTabUpdate').default);
            })
        })
    },{
        name : 'product.view'
    })
    router.addRoute('/product/:id/duplicate',function(){
        if(window.hasPermission('product.self') == true){
            return new Promise(function(resolve){
                require.ensure([],function(){
                    resolve(require('./ProductTabSelfNewCopy').default);
                })
            })
        }
        return new Promise(function(resolve){
            require.ensure([],function(){
                resolve(require('./ProductTabNewCopy').default);
            })
        })
    },{
        name : 'product.duplicate'
    })
}