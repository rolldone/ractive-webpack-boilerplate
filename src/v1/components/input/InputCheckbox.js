import template from './views/InputCheckboxView.html';
let InputCheckbox = BaseRactive.extend({
  template,
  data : function(){
    return {
      custom_name_text : ''
    }
  },
  isolate : true,
  onconfig : function(){
    this.set('custom_name_text',`name='${this.get('name')}'`); 
  },
  onrender : function(){},
  oncomplete : function(){},
})

export default InputCheckbox;