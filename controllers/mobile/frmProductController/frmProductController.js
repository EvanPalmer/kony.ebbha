define({ 
  productId : 1837061, //test ID is overwritten onNavigate

  onInit : function(){
  },

  onPreShow:function(){
    this.resetEverything();
  },

  onPostShow : function(){
    this.view.topNavigation.myBackFormId = ebbhaAppConstants.frmProductList;
    ebbhaAppConstants.dismissLoadingScreen();
    //     this.getProductDetails();
  },
  
  resetEverything:function(){
    this.view.imgThumbnail.src = "";
    this.view.lblName.text = "";
    this.view.lblPrice.text = "";
    this.view.lblAverageReview.text = "";
    this.view.stars.starRating = 0;
    this.view.segReviews.removeAll();
  },
  
  onNavigate : function(context, isBackNavigation){
    this.productId = context.productId;
    this.getProductDetails();
  },

  // this method can be used when orchestration is not working
  getProductDetails:function(){
    ebbhaAppConstants.showLoadingScreen();
    var operationName = "getProductDetails";
    var inputParams = {
      "productId": this.productId,
      "httpheaders": {} 
    };

    mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindProducts);
  },

  // This method can be used with Orchestration is working
  getProductDetailsAndReviews:function(){
    ebbhaAppConstants.showLoadingScreen();
    var serviceName = "BestBuyRootOrchestration";
    var operationName = "getProductWithReviews2";
    var inputParams = {"productId": this.productId, 
                       "httpheaders": {}};
    mfintegrationsecureinvokerasync(inputParams, serviceName, operationName, this.bindProducts);
  },

  bindProducts: function(status, response){
    if(response.opstatus !== 0){
      alert("ERROR! Retreive Product Detail unsuccessful. \nStatus" + status + "\nresponse: " + ebbhaAppConstants.ebbhaStringify(response));
    } else {
      this.view.imgThumbnail.src = response.thumbnail;
      this.view.lblName.text = response.name;
      var displayPriceText = response.displayPrice;

      if(response.isOnSale) {
        displayPriceText = "On sale! " + displayPriceText;
      }

      this.view.lblPrice.text = displayPriceText;
      if(response.customerReviewCount === 0){
        this.view.lblAverageReview.text = "Not enough reviews.";
      }else{
        this.view.lblAverageReview.text = "Av. response: " + response.customerReviewAverage;
        this.view.stars.starRating = response.customerReviewAverage;
      }

      this.view.lblDescription.text = response.description;
      this.view.lblCustomerReviewCount.text = "Number of reviews: " + response.customerReviewCount;
	  
      //this.doBindReviews(response.reviews);

      this.getReviews(response.sku);
    }
  },

  getReviews:function(sku){
    ebbhaAppConstants.showLoadingScreen();
    kony.print("Getting the reviews for sku: " + sku);
    var operationName = "getUserReviews";
    var inputParams = {
      "sku": sku,
      "httpheaders": {} 
    };

    mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindReviews);
  },

  bindReviews: function(status, response){
    kony.print("Got the reviews: " + ebbhaAppConstants.ebbhaStringify(response.reviews));
    if(response.opstatus !== 0){
      alert("ERROR! Retreive Review Detail unsuccessful. \nStatus" + status + "\nresponse: " + ebbhaAppConstants.ebbhaStringify(response));
    }else{
		this.doBindReviews(response.reviews);
    }
    ebbhaAppConstants.dismissLoadingScreen();
  },

  doBindReviews:function(reviews){
    var reviewsWithStars = this.setUpStarImages(reviews);
    this.view.segReviews.widgetDataMap = {
      lblTitle : "title",
      lblReviewerName : "reviewerName",
      lblDescription : "comment",
      imgStar1 : "imgStar1",
      imgStar2 : "imgStar2",
      imgStar3 : "imgStar3",
      imgStar4 : "imgStar4",
      imgStar5 : "imgStar5"
    };
    this.view.segReviews.setData(reviewsWithStars);
    ebbhaAppConstants.dismissLoadingScreen();
  },
  // Couldn't use my star component because I can't put a component in a segment.
  setUpStarImages: function(reviews){
    var onImage = "staron.png";
    var offImage = "staroff.png";

    for(var i = 0; i < reviews.length; i++){
      var rating = reviews[i].rating;

      if(rating > 0)
      {
        reviews[i].imgStar1 = onImage;
      } else {
        reviews[i].imgStar1 = offImage;
      }

      if(rating > 1)
      {
        reviews[i].imgStar2 = onImage;
      } else {
        reviews[i].imgStar2 = offImage;
      }

      if(rating > 2)
      {
        reviews[i].imgStar3 = onImage;
      } else {
        reviews[i].imgStar3 = offImage;
      }

      if(rating > 3)
      {
        reviews[i].imgStar4 = onImage;
      } else {
        reviews[i].imgStar4 = offImage;
      }

      if(rating > 4)
      {
        reviews[i].imgStar5 = onImage;
      } else {
        reviews[i].imgStar5 = offImage;
      }
    }
    return reviews;
  }
});