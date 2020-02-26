import '@app/assets/sweetalert2/dist/sweetalert2.min.css';

var swalDeleted = function(message) {
    return Swal.fire(
  'Deleted!',
  message,
  'success'
)
    return swal.fire({
        imageUrl: '',
        imageWidth: 100,
        title: message,
        // customClass: 'artywiz-sweetalert'
    });
}

window.swalSuccess = function(title,message,callback) {
    window.staticType(title,[String]);
    window.staticType(message,[null,String,Boolean]);
    return Swal.fire(
  title,
  message,
  'success'
).then(function(result){
        if(callback != null){
            window.staticType(callback,[Function])
            callback(result);
        }
    });
    return swal({
        imageUrl: '',
        imageWidth: 100,
        title: message,
        customClass: 'artywiz-sweetalert',
        confirmButtonText : 'Ok'
    })
}

var swalConfirm = function(props,callback) {
    return swal.fire({
      text: props.text,
      type: props.type || 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: props.confirmButtonText
    }).then(function(result){
        callback(result);
    });
}

var swalMailSend = function(message) {
    return swal({
        imageUrl: '',
        imageWidth: 100,
        title: message,
        customClass: 'artywiz-sweetalert'
    });
}

var swalFailure = function(title, message,callback) {
    window.staticType(title,[String]);
    window.staticType(message,[null,String,Boolean]);
    return Swal.fire(
  title,
  message,
  'error'
).then(function(result){
        if(callback != null){
            window.staticType(callback,[Function])
            callback(result);
        }
    });
    return swal({
        imageUrl: '/assets/icon-logo/artycoin-atc.svg',
        title: title || "Opps, You are getting error!",
        text: message,
        confirmButtonText: "retourner",
        customClass: 'artywiz-sweetalert'
    });
}