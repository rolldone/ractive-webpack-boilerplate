import BaseRactive from "../../lib/ractive/BaseRactive";
import template from './views/logout.html';
export default BaseRactive.extend({
    template,
    isolate : true,
    onconfig : function(){
        window.localStorage.removeItem('token');
    },
  })