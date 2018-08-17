define(function() {
  return {
    searchState: require("SearchState"),
    zIndexOut: 400,
    zIndexIn: 1,
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.view.flxSlideDown.opacity = 0;
      this.searchState.searchIsOut = false;
      this.view.txtSearchInput.text = this.searchState.searchTerm;
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

    animateSearch: function(eventobject, x, y) {
      kony.print("!!!: animateSearch");
      if(this.searchState.searchIsOut){
        this.doSlide();
      }else{
        this.view.flxSlideDown.zIndex = this.zIndexOut;
        this.doFade();
      }

//     this.view.flxTopNavigation.animate(
//     kony.ui.createAnimation({
//         "100": {
//             "stepConfig": {
//                 "timingFunction": kony.anim.EASE
//             },
//             "width": "100%",
//             "height": "75dp"
//         }
//     }), {
//         "delay": 1,
//         "iterationCount": 1,
//         "fillMode": kony.anim.FILL_MODE_FORWARDS,
//         "duration": 1000
//     }, {
//         "animationEnd": alert("Done")
//     });
      
    },

    doFade:function(){
      var opacity = 1;
      var nextStep = this.doSlide;

      if(this.searchState.searchIsOut){
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

      if(this.searchState.searchIsOut){
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
      if(this.searchState.searchIsOut){
        this.view.flxSlideDown.zIndex = this.zIndexIn;
      }

      this.searchState.searchIsOut = !this.searchState.searchIsOut;
      kony.print("!!!: Animation complete. ");
    },

    goBack : function(){
      var nav;
      nav = new kony.mvc.Navigation(this.myBackFormId);
      nav.navigate();
    },

    doCancel : function(){      
      this.searchState.searchIsOut = false;
      this.searchState.searchTerm = "";
      this.refresh();
    },
    
    doSearch : function(){
      
      var nav = new kony.mvc.Navigation(ebbhaAppConstants.frmProductList);
	  var searchTerm = this.view.txtSearchInput.text;
      this.searchState.searchTerm = searchTerm;
      if(searchTerm !== null && searchTerm.length > 0)
      {
        nav.navigate({searchTerm : searchTerm});
	  }
    },
    
    refresh:function(){
      kony.print("Refresh Top Navigation");
      this.view.txtSearchInput.text = this.searchState.searchTerm;
      this.animateSearch();
    }
  };
});