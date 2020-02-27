export default function(next){
    /* tidak punya token back to login */
    if(window.localStorage.getItem('token') == null){
        alert('vdfv');
        window.location.href = '/auth/login';
        return;
    }
    /* User yang telah login */
    next(null);
}