import template from './views/InputView.html';
import BaseRactive from '../../../lib/ractive/BaseRactive';

let InputText = BaseRactive.extend({
  template,
  data : function(){
    return {
      add : '#',
      visibility : {
        add : 'show',
        delete : 'hide'
      }
    }
  },
  isolate : true,
  onconfig : function(){},
  onrender : function(){},
  oncomplete : function(){}
})

export default InputText;