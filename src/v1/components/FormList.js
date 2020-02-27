import BaseRactive from 'BaseRactive';
import template from './views/FormList.html';

export default BaseRactive.extend({
    template,
    data : function(){
        return {
            datas : [],
            ref : `form.list.${(new Date()).getMilliseconds()}`
        }
    },
    onconfig : function(){},
    oncomplete : async function(){
        let self = this;
        let resDatas = await self.getHttpDatas();
        self.setDatas(resDatas);
    },
    setConfirmBeforeDelete : function(isCOnfirm){
        window.staticType(isCOnfirm,[Boolean]);
        this.set('is_confirm_to_delete',isCOnfirm);
    },
    pushDatas : function(props){
        window.staticType(props,[Object]);
        let self = this;
        let datas = self.get('datas');
        datas.push(props);
        self.set('datas',datas);
    },
    setDatas : function(props){
        window.staticType(props,[Array,null]);
        if(props == null)
            return;
        let self = this;
        self.set('datas',props);
    },
    deleteDatas : function(props){
        window.staticType(props,[Object]);
        let datas = this.get('datas');
        datas.splice(0,)
    },
    getDatas :  function(){
      return this.get('datas');
    },
    setOnFormListListener : function(func){
                let self = this;
      window.staticType(func,[Function]);
      self.onFormListListener = func;
    },
    handleClick : function(action,props,e){
        let self = this;
        if(e != null)
            e.preventDefault();
        switch(action){
            case 'DELETE':
            if(self.get('is_confirm_to_delete') == true)
                return self.onFormListListener('CONFIRM_DELETE',props,e);
            self.onFormListListener(action,props,e);
            break;
            case 'EDIT':
            self.onFormListListener(action,props,e);
            break;
        }
    },
    getHttpDatas : async function(){
        let self = this;
        return null;
    }
})