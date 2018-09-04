define({ 
  categoryName:null,
  categoryId:null, 
  products:null,
  productId:null,
  searchTerm:null,
  searchPage:1,
  finalPageReached:false,
  
  onInit : function(){
  },
  
  onPreShow : function(){
  },

  onPostShow : function(){
    this.view.topNavigation.myBackFormId = ebbhaAppConstants.frmHome;
    ebbhaAppConstants.dismissLoadingScreen();
    this.setAnimation();
  },

  onNavigate : function(context, isBackNavigation){
    // test data
    //       this.categoryId = "abcat0300000";
    //       this.categoryName = "Overridden category!";
    //       this.searchTerm = "kanye";
    // end test data

    if(!ebbhaAppConstants.isNullOrUndefined(context)) {

      if(!context.isGoBack){
        this.categoryName = null;  
        this.categoryId = null;
        this.products = null;
        this.productId = null;
        this.view.segProducts.removeAll();
      }
      if(!ebbhaAppConstants.isNullOrEmpty(context.categoryId)){
        this.categoryId = context.categoryId;
        this.categoryName = context.categoryName;
        this.searchTerm = null;
      } else if(!ebbhaAppConstants.isNullOrEmpty(context.searchTerm)){
        this.categoryId = null;
        this.categoryName = null;
        this.searchTerm = context.searchTerm;
      }
    }
    if(!context.isGoBack){
      this.getProducts();
    }
  },
  
  getProducts: function(){
    kony.print("Gonna get the products for CategoryID: " + this.categoryId);
    if(this.isASearch()){
      this.view.lblCategoryName.text = "Results for: " + this.searchTerm;
      this.getProductsBySearchText(this.searchTerm);
    }else{
      this.view.lblCategoryName.text = "category: " + this.categoryName;
      this.getProductListByCategoryId(this.categoryId);
    }
  },
  
  onHide: function(){
  },
  
  isASearch : function(){
    return !ebbhaAppConstants.isNullOrEmpty(this.searchTerm);
  },

  getProductsBySearchText:function(){
    ebbhaAppConstants.showLoadingScreen();
    var operationName = "getProductsBySearchText";
    var inputParams = { "searchText": this.searchTerm,
                       "page" : this.searchPage,
                       "httpheaders": {} };
    mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindProducts);
  },

  getProductListByCategoryId:function(categoryId){
    ebbhaAppConstants.showLoadingScreen();
    var operationName = "getProductsByCategoryId";
    var inputParams = { "categoryId": categoryId,
                       "page" : this.searchPage,
                       "httpheaders": {} };
    mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindProducts);
  },

  bindProducts: function(status, response){
    this.showNoResults();

    if(response.opstatus > 0)
    {
      alert("ERROR! Retreive Products unsuccessful. \nStatus" + status + "\nresponse: " + ebbhaAppConstants.ebbhaStringify(response));
    } else {
      var currentProducts = response.products;

      kony.print("Gonna bind the old products list for these products: " + ebbhaAppConstants.ebbhaStringify(this.products));

      this.productId = response.productId;
      this.finalPageReached = false;

      if(ebbhaAppConstants.isNullOrEmpty(currentProducts)) {
        kony.print("No products found for category ID " + this.categoryId);
        kony.print("The label is visiable and the height is at 100!");
        this.finalPageReached = true;
      } else {
        kony.print("Products is NOT empty!");
      }

      var segProducts = this.view.segProducts;
      this.updateProductsListForSaleItems(currentProducts);

      segProducts.widgetDataMap = { "lblTitle" : "name", 
                                   "lblPrice" : "displayPrice", 
                                   "lblRating" : "displayRating", 
                                   "imgThumbnail" : "imageThumbnail" };
      if(this.searchPage == 1){
        segProducts.setData(currentProducts);
        this.products = currentProducts;
      }else{
        segProducts.addAll(currentProducts);
        this.products = this.products.concat(currentProducts);
      }
    }
    this.showNoResults();
    ebbhaAppConstants.dismissLoadingScreen();
  },
  showNoResults:function(){
    if(ebbhaAppConstants.isNullOrEmptyArray(this.products))
      {
        this.view.lblNoResults.setVisibility(true);
        this.view.flxNoResults.setVisibility(true);
         this.view.flxNoResults.height = "100dp";
      }else{
        this.view.lblNoResults.setVisibility(false);
        this.view.flxNoResults.setVisibility(false);
        this.view.flxNoResults.height = "0dp";
      }
  },

  // this should be done in the post processor, but the java perspective crashes my machine.
  // and there is no documentation to describe the "request" object in the javascript post processor.
  updateProductsListForSaleItems : function(currentProductList) {
    for(var i = 0; i < currentProductList.length; i++){
      currentProductList[i].displayPrice = "$" + currentProductList[i].price;
      currentProductList[i].imageThumbnail = currentProductList[i].imageUrls.thumbnail;
      currentProductList[i].rating = currentProductList[i].customerReviewAverage;
	  if(!ebbhaAppConstants.isNullOrEmpty(currentProductList[i].customerReviewAverage)){
        currentProductList[i].displayRating = "Avg user rating: " + currentProductList[i].customerReviewAverage;
      }

      if(currentProductList[i].isOnSale){
        currentProductList[i].template = "flxProductListSale";
        currentProductList[i].displayPrice = "$" + currentProductList[i].salePrice;
      }
    }
  },

  setAnimation : function() {
    var transformStart = kony.ui.makeAffineTransform();
    var transformEnd = kony.ui.makeAffineTransform();
    var animationType = "scale";

    transformStart.scale(0,0);
    transformEnd.scale(1,1);

    var animationObject = kony.ui.createAnimation(
      {"0":{"transform":transformStart,"stepConfig":{"timingFunction":kony.anim.LINEAR}},
       "100":{"transform":transformEnd,"stepConfig":{"timingFunction":kony.anim.LINEAR}}});
    var animationConfig = {
      duration: 0.75,
      fillMode: kony.anim.FILL_MODE_FORWARDS
    };

    var animationCallbacks = {"animationEnd":function(){kony.print("animation END");}};
    var animationDefObject={definition:animationObject,config:animationConfig,callbacks:animationCallbacks};
    this.view.segProducts.setAnimations({visible:animationDefObject});
  },

  onReachingEnd : function(){
    if(!this.finalPageReached){
      this.searchPage = this.searchPage + 1;
   	  this.getProducts();
    }
  },

  segProductsOnRowClick : function(eventObject, sectionNumber, rowNumber){
    kony.print("!!!eventObject: " + ebbhaAppConstants.ebbhaStringify(eventObject));
    var selected = this.view.segProducts.selectedRowItems;

    if(selected === null) selected = eventObject.selecteditems;
    if(selected === null || selected === undefined) {
      alert("Nothing selected!");
      return;
    }

    if(ebbhaAppConstants.isNullOrEmpty(selected[0].productId)) {
      alert("Sorry! No product details available - no product ID!");
    } else {
      var params = { productId : selected[0].productId };
      var nav = new kony.mvc.Navigation(ebbhaAppConstants.frmProduct);
      ebbhaAppConstants.showLoadingScreen();
      nav.navigate(params);
    }
  },
});