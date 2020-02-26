import template from './views/InputDropdownView.html';
import BaseRactive from '../../../lib/ractive/BaseRactive';
/** Pass Props : 
------------------------------------------
- datas
- dropdown_text
- other_value_key
- name
- id
- label
- form_title
----------------------------------------- **/
var InputDropdown = BaseRactive.extend({
  template,
  data : function(){
    return {
      _datas : [],
    }
  },
  isolate : true,
  onconfig : function(){
    let self = this;
    self.watchData = this.observe('datas',function(newValue,oldValue,keyPath){
      console.log('bbbbbbbbbb',newValue)
      var tempDatas = Object.assign([],newValue);
      var dropdown_text = self.get('dropdown_text');
      var other_value_key = self.get('other_value_key');
      for(var a=0;a<tempDatas.length;a++){
        tempDatas[a].label = tempDatas[a][dropdown_text];   
        tempDatas[a].key = tempDatas[a][other_value_key];
        if(tempDatas[a].id == null){
          tempDatas[a].id = tempDatas[a][other_value_key];
        }
      }      
      self.set('_datas',tempDatas);
    })
  },
  onrender : function(){},
  oncomplete : async function(){
    let self = this;
  },
  loadDropdown : function(){
    let self = this;
    if(self.onChangeListener == null){
      return;
    }
    if(self.inputDropdown == null){
      let dropdownCOnfig = {
        onChange : function(value,text,$selected){
          if(value == ""){
            return;
          }
          // console.log('value',value);
          // console.log('text',text);
          // console.log('key',$($selected).attr('data-key'));
          let hidden = $($selected).parent();
          hidden = hidden.siblings('input[type=hidden]');
          let name = hidden.attr('name');
          let dataKey = $($selected).attr('data-key');
          if(self.onChangeListener != null){
            self.onChangeListener({
              value : value,
              key : dataKey,
              name : name
            },$selected)
          }
        }
      }
      /* Jika menggunakan http request async */
      if(self.apiSettings != null){
        dropdownCOnfig.apiSettings = self.apiSettings;
      }
      console.log('inputdropdwon',self.apiSettings);
      self.inputDropdown = $(self.find('#'+self.get('id'))).dropdown(dropdownCOnfig); 
    }
  },
  setValue : function(value){
    let self = this;
    console.log('inputDropdown',self.inputDropdown);
    if(self.onChangeListener == null)
      alert('Need defined onChangeListener!');
    if(value == null)
      return self.inputDropdown.dropdown('clear');
    self.inputDropdown.dropdown('set selected',value+'');
  },
  setOnChangeListener : function(theFunction,apiSettingFunc){
    window.staticType(apiSettingFunc,[Function,null]);
    window.staticType(theFunction,[Function]);
    let self = this;
    self.onChangeListener = theFunction;
    if(apiSettingFunc != null){
      self.apiSettings = {
        responseAsync : apiSettingFunc
      };
    }
    self.loadDropdown();
  },
})

export default InputDropdown;

