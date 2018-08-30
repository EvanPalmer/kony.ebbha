define({ 
  productId : 1837061, //test ID is overwritten onNavigate

  onInit : function(){
  },
  
  onPostShow : function(){
    this.view.topNavigation.myBackFormId = ebbhaAppConstants.frmProductList;
    ebbhaAppConstants.dismissLoadingScreen();
    //     this.getProductDetails();
  },

  onNavigate : function(context, isBackNavigation){
    this.productId = context.productId;
    this.getProductDetails();
  },

  getProductDetails:function(){
    ebbhaAppConstants.showLoadingScreen();
    var operationName = "getProductDetails";
    var inputParams = {
      "productId": this.productId,
      "httpheaders": {} 
    };

    mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindProducts);
  },

  getProductDetailsAndReviews:function(){
    // Can't get orchestration service to work :(
    // Have to use a second call.
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
      // This doesnt match what is returned so instead I'll use a count of what's returned when I bind the reviews
      // this.view.lblCustomerReviewCount.text = "Number of reviews: " + response.customerReviewCount;

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
      this.view.segReviews.widgetDataMap = {
        lblTitle : "title",
        lblReviewerName : "reviewerName",
        lblDescription : "comment"
      };
      this.view.lblCustomerReviewCount.text = "Number of reviews: " + response.reviews.length;
      this.view.segReviews.setData(response.reviews);
    }
    ebbhaAppConstants.dismissLoadingScreen();
  }
});