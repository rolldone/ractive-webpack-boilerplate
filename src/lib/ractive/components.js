import BaseRactive from './BaseRactive';
import LinkView from './views/LinkView.html';
BaseRactive.components.checkmark = BaseRactive.extend({
  data: {
    value: false
  },
  template: '<i class="fa fa-{{#if value}}check-circle{{else}}circle-o{{/if}}"></i>',
});

BaseRactive.components.Icon = BaseRactive.extend({
  data: {
    class: '',
    name: '',
    size: false
  },
  template: '<i class="fa fa-{{name}} {{#size}}fa-{{size}}{{/size}} {{class}}" />',
});

BaseRactive.components['route-link'] = BaseRactive.extend({
  template : LinkView,
  isolate : true,
  handleClick : function(action,props,e){
      let self = this;
      switch(action){
          case 'HREF':
              e.preventDefault();
              if(Object.keys(self._subs).length > 0){
                  if(self._subs.linkClickListener.length > 0){
                      return self.fire('linkClickListener',e);
                  }
              }
              let href = $(e.target).attr('href');
              if(self.validURL(href) == true){
                  return window.location.href = href;
              }
              self.dispatch(href);
              break;
      }
  },
  setOnClickListener : function(onCLickListener){
      window.staticType(onCLickListener,[Function]);
      this.onCLickListener = onCLickListener
  }
})