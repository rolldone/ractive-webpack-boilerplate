import template from './views/InputSearchDropdownView.html';
import InputDropdown from './InputDropdown.js';

var InputSearchDropdown = InputDropdown.extend({
  template,
  data : function(){
    return {
      _datas : []
    }
  },
  isolate : true,
  onconfig : function(){
    let self = this;
    self.watchData = this.observe('datas',function(newValue,oldValue,keyPath){
      var tempDatas = Object.assign([],newValue);
      var dropdown_text = self.get('dropdown_text');
      var other_value_key = self.get('other_value_key');
      for(var a=0;a<tempDatas.length;a++){
        tempDatas[a].label = tempDatas[a][dropdown_text];   
        tempDatas[a].key = tempDatas[a][other_value_key];
      }      
      self.set('_datas',tempDatas);
    })
  },
  onrender : function(){},
  oncomplete : function(){},
})

export default InputSearchDropdown;