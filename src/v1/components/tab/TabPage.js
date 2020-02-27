import BaseRactive from "BaseRactive";
import template from './views/TabPageView.html';
export default BaseRactive.extend({
    template,
    isolate : true,
    data : function(){
        return {
            ref : null,
            target : null
        }
    },
    onconfig : function(){
        let self = this;
        self._super();
        window.pubsub.on('element.tab.tab_page',self.responseAction.bind(self));
    },
    oncomplete : function(){},
    onrender : function(){},
    responseAction : function(props){
        let self = this;
        self.set('target',props.target);
    }
})