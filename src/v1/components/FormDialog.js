import BaseRactive from 'BaseRactive';
import template from './views/FormDialogView.html'
export default BaseRactive.extend({
    isolate : true,
    template,
    data : function(){
        return {
            root_id : (new Date()).getMilliseconds()+'_form_dialog'
        }
    },
    setOnFormDialogListener : function(func){
        window.staticType(func,[Function]);
        let self = this;
        self.onFormDialogListener = func;
    },
    open : function(){
        let self = this;
        $(`#${self.get('root_id')}`).modal('show');
    },
    dispose : function(){
        let self = this;
        $(`#${self.get('root_id')}`).modal('hide');
    },
    handleClick : function(action,props,e){
        let self = this;
        switch(action){
            case 'SUBMIT':
                self.onFormDialogListener(action,props,e);
            break;
            case 'CLOSE':
                self.onFormDialogListener(action,props.e);
            break;
        }
    }
})