define(function() {

	return {
        searchIsOut: false,
        zIndexOut: 200,
        zIndexIn: 1,

		constructor: function(baseConfig, layoutConfig, pspConfig) {
	        this.view.flxSlideDown.opacity = 0;
            this.searchIsOut = false;
		},

		//Logic for getters/setters of custom properties
		initGettersSetters: function() {
// 			defineGetter(this, "myFormId",function(){
// 			  kony.print("!!@@!@!@defineGetter.myFormId: "+ this._myFormId);
//               return this._myFormId;
//             });
//             defineSetter(this, "myFormId", function(myFormId){
// 			  kony.print("!!@@!@!@defineSetter.myFormId: "+ myFormId);
//               this._myFormId = myFormId;
//             });
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
        }
	};
});