define({ 
  productId : 1,
  onPostShow : function(){
//     this.productId = "1837061";
//     this.getProductDetails();
  },
  onNavigate : function(context, isBackNavigation){
    this.productId = context.productId;
    this.getProductDetails();
  },
  getProductDetails:function(){
    var operationName = "getProductDetails";
    var inputParams = {
      				   "productId": this.productId,
                       "httpheaders": {} 
    				  };
    
    mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindProducts);
  },
  
  bindProducts: function(status, response){
	if(response.opstatus !== 0){
      alert("ERROR! Retreive Product Detail unsuccessful. \nStatus" + status + "\nresponse: " + ebbhaAppConstants.ebbhaStringify(response));
    }else{
      this.view.imgThumbnail.src = response.thumbnail;
      this.view.lblName.text = response.name;
      var displayPriceText = response.displayPrice;
      
      if(response.isOnSale) {
        displayPriceText = "On sale! " + displayPriceText;
      }
      
      this.view.lblPrice.text = displayPriceText;
      this.view.lblAverageReview.text = "5?";      
      this.view.lblDescription.text = response.description;

      this.view.lblCustomerReviewCount = "Number of reviews: " + response.customerReviewCount;
    }
  },
 });