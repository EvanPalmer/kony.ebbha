define(function() {
  return {
    searchIsOut: false,
    zIndexOut: 400,
    zIndexIn: 1,
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.view.flxSlideDown.opacity = 0;
      this.searchIsOut = false;
    },

    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, "myBackFormId",function(){
        kony.print("!!@@!@!@defineGetter.myBackFormId: "+ this._myBackFormId);
        return this._myBackFormId;
      });
      defineSetter(this, "myBackFormId", function(myBackFormId){
        kony.print("!!@@!@!@defineSetter.myFormId: "+ myBackFormId);
        this.view.imgBack.isVisible = true;
        this._myBackFormId = myBackFormId;
      });
    },

    animateSearch: function(eventobject, x, y) {
      kony.print("!!!: animateSearch");
      if(this.searchIsOut){
        this.doSlide();
      }else{
        this.view.flxSlideDown.zIndex = this.zIndexOut;
        this.doFade();
      }
    },

    doFade:function(){
      var opacity = 1;
      var nextStep = this.doSlide;

      if(this.searchIsOut){
        opacity = 0;
        nextStep = this.animationDone;
      }

      this.view.flxSlideDown.animate(
        kony.ui.createAnimation({
          "100": {
            "stepConfig": {
              "timingFunction": kony.anim.EASE
            },
            "opacity": opacity
          }
        }), {
          "delay": 0,
          "iterationCount": 1,
          "fillMode": kony.anim.FILL_MODE_FORWARDS,
          "duration": 1
        }, {
          "animationEnd": nextStep
        });
    },

    doSlide:function(){
      var top = "75dp";
      var nextStep = this.animationDone;
      var zindex = 1;

      if(this.searchIsOut){
        top = "0dp";
        nextStep = this.doFade;
      }

      this.view.flxSlideDown.animate(
        kony.ui.createAnimation({
          "100": {
            "top": top,
            "stepConfig": {
              "timingFunction": kony.anim.EASE
            }
          }
        }), {
          "delay": 0,
          "iterationCount": 1,
          "fillMode": kony.anim.FILL_MODE_FORWARDS,
          "duration": 1
        }, {
          "animationEnd": nextStep
        });
    },

    animationDone : function(){ 
      if(this.searchIsOut){
        this.view.flxSlideDown.zIndex = this.zIndexIn;
      }

      this.searchIsOut = !this.searchIsOut;
      kony.print("!!!: Animation complete. ");
    },

    goBack : function(){
      var nav;
      nav = new kony.mvc.Navigation(this.myBackFormId);
      nav.navigate();
    },

    doCancel : function(eventobject, x, y){
      this.animateSearch(eventobject, x, y);
		this.view.txtSearchInput.text = null;
    },
    doSearch : function(){
      alert("Doing search");
      var nav = new kony.mvc.Navigation(ebbhaAppConstants.frmProductList);
	  var searchTerm= this.view.txtSearchInput.text;
      
      if(searchTerm !== null && searchTerm.length > 0)
      {
        nav.navigate({searchTerm : searchTerm});
	  }
    }
  };
});