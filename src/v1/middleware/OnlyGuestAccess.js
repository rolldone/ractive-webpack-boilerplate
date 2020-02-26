export default function(next){
    /* Jika targetnya logout next aja */
    if(window.router.uri.path == "/logout"){
        return next(null);
    }
    /* Selain dari logout redirect ke logout */
    if(window.localStorage.getItem('token') != null){
        window.router.dispatch('/auth/logout',{ noHistory:true });
        return;
    }
    /* User yang belum login */
    next(null);
}