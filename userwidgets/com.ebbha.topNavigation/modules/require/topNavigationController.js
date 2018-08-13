define(function() {

	return {
        searchIsOut: false,
		constructor: function(baseConfig, layoutConfig, pspConfig) {
	        this.view.flxSlideDown.opacity = 0;
            this.searchIsOut = false;
		},

		//Logic for getters/setters of custom properties
		initGettersSetters: function() {
// 			defineGetter(this, "myFormId",function(){
//               return this._myFormId;
//             });
//             defineSetter(this, "myFormId", function(myFormId){
//               this._myFormId = myFormId;
//             });
        },
      
       animateSearch: function(eventobject, x, y) {
        if(this.searchIsOut){
			this.doSlide();
        }else{
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
          this.searchIsOut = !this.searchIsOut;
          alert("done!");
        }
	};
});