import template from './views/TabHeadView.html';
import BaseRactive from 'BaseRactive';

export default BaseRactive.extend({
    template,
    isolate : true,
    data : function(){
        return {
            active : -1,
            tabs : []
        }
    },
    onconfig : function(){
        let self = this;
        self.unwatchActive = self.observe('active',async function(val){
            try{
                if(self.getOnListener == null){
                    throw 'setOnClickListener should defined!';
                }
                await self.waitingTimeout(1000);
                self.getOnListener(val);
            }catch(ex){
                // console.error(ex);
            }
        })
        self.setTabActive(self.get('active'));
    },
    oncomplete : function(){
        let self = this;
    },
    onrender : function(){},
    handleClick : async function(action,props,e){
        let self = this;
        if(self.get('tabs')[props.index] == null){
            alert('Need set target on tab page!');
            return;
        }
        let target = self.get('tabs')[props.index].key;
        switch(action){
            case 'CLICK':
                await self.set('active',props.index);
                window.pubsub.emit('element.tab.tab_page',{
                    target : target,
                    index : props.index
                })
            break;
        }
    },
    setOnClickListener : function(func){
        let self = this;
        try{
            if(func == null){
                throw 'setOnClickListener should be defined';
            }
            self.getOnListener = func;
        }catch(ex){
            console.error(ex);
        }
    },
    setTabActive : function(index){
        let self = this;
        self.handleClick('CLICK',{index : index},null);
    },
})