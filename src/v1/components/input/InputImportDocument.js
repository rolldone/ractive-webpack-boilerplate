import template from './views/InputImportDocumentView.html';
let ImportDocument = InputImport.extend({
  template,
  data : function(){
    return {
      add : '#',
      visibility : {
        add : 'show',
        delete : 'hide'
      },
      importedImg: 'https://subscriptionboxesformen.club/wp-content/uploads/2019/06/placeholder.png',
      defaultImg: "https://subscriptionboxesformen.club/wp-content/uploads/2019/06/placeholder.png"
    }
  },
  isolate : true,
  onconfig : function(){},
  onrender : function(){},
  oncomplete : function(){
    $('#button').click(function(){
      $("input[type='file']").trigger('click');
    })

    $("input[type='file']").change(function(){
      $('#val').text(this.value.replace(/C:\\fakepath\\/i, ''))
    })  
  },
  setOnChangeListener : function(onChangeListener){
    let self = this;
    self.onChangeListener = onChangeListener;
  },
  resetPreview(){
    let self = this;
    let file = document.querySelector('input[type=file]').files[0];
    if( file == undefined ){
      self.set('importedImg', self.get('defaultImg'));
    }
  },
  handleChange(e){
    let self = this;
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();

    if( file == undefined ){
      self.set('importedImg', self.get('defaultImg'));
    }

    reader.addEventListener("load", function () {
      // convert image file to base64 string
      self.set('importedImg', reader.result);
      // self.onChangeListener('FILE',reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
      self.onChangeListener('photo', file);
    }
  }
})

export default ImportDocument;