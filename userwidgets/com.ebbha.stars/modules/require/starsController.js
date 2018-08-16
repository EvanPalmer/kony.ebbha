define(function() {

	return {
		constructor: function(baseConfig, layoutConfig, pspConfig) {

		},
		//Logic for getters/setters of custom properties
		initGettersSetters: function() {
	      defineSetter(this, "starRating", function(starRating){
            this._starRating = starRating;
            this.setStars(starRating);
          });
		},
      
        setStars : function(rating){
		  kony.print("!!! Rating Is: " + rating);
		  var onImage = "staron.png";

          if(rating > 0)
          {
            this.view.imgStar1.src = onImage;
          }
          if(rating > 1)
          {
            this.view.imgStar2.src = onImage;
          }
          if(rating > 2)
          {
            this.view.imgStar3.src = onImage;
          }
          if(rating > 3)
          {
            this.view.imgStar4.src = onImage;
          }
          if(rating > 4)
          {
            this.view.imgStar5.src = onImage;
          }
          
        }
	};
});