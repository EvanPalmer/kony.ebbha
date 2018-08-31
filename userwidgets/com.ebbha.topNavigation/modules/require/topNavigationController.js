define(function() {
  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
    },

    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, "myBackFormId",function(){
        kony.print("!!@@!@!@defineGetter.myBackFormId: "+ this._myBackFormId);
        return this._myBackFormId;
      });
      defineSetter(this, "myBackFormId", function(myBackFormId){
        kony.print("!!@@!@!@defineSetter.myFormId: "+ myBackFormId);
        this._myBackFormId = myBackFormId;
      });
    },

    goBack : function(){
      var nav;
      nav = new kony.mvc.Navigation(this.myBackFormId);
      nav.navigate({isGoBack: true, previousForm: kony.application.getCurrentForm().id});
    }
    
  };
});