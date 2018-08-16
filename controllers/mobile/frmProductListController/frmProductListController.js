define({ 
  categoryName:null,
  categoryId:null, 
  products:null,
  productId:null,
  searchTerm:null,
  searchPage:1,
  finalPageReached:false,

  onPostShow : function(){
    this.categoryId = "abcat0300000";
    this.categoryName = "Overridden category!";
    this.searchTerm = "ipad";
    this.setAnimation();
    this.finalPageReached = false;

    if(this.isASearch()){
      this.view.lblCategoryName.text = "Results for: " + this.searchTerm;
      this.getProductsBySearchText(this.searchTerm);
    }else{
      this.view.lblCategoryName.text = "category: " + this.categoryName;
      this.getProductListByCategoryId(this.categoryId);
    }
  },
  //     onNavigate : function(context, isBackNavigation){
  //         this.categoryId = context.categoryId;        
  //         this.categoryName = context.categoryName;
  //         this.searchTerm = context.searchTerm;
  //         this.getProductListByCategoryId(this.categoryId);
  //         this.setAnimation();
  //     },
  isASearch : function(){
    return !ebbhaAppConstants.isNullOrEmpty(this.searchTerm);
  },
  getProductsBySearchText:function(){
    var operationName = "getProductsBySearchText";
    var inputParams = { "searchText": this.searchTerm,
                       "page" : this.searchPage,
                       "httpheaders": {} };
    mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindProducts);
  },
  getProductListByCategoryId:function(categoryId){
    var operationName = "getProductsByCategoryId";
    var inputParams = { "categoryId": categoryId,
                       "httpheaders": {} };
    mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindProducts);
  },
  bindProducts: function(status, response){
    if(response.opstatus > 0)
    {
      alert("ERROR! Retreive Products unsuccessful. \nStatus" + status + "\nresponse: " + ebbhaAppConstants.ebbhaStringify(response));
      this.view.flxNoResults.isVisible = true;
    } else {
      this.products = response.products;
      this.productId = response.productId;

      if(ebbhaAppConstants.isNullOrEmpty(this.products)) {
        this.view.flxNoResults.isVisible = true;
        this.finalPageReached = true;
      }else{
        this.view.flxNoResults.isVisible = false;
      }

      if(this.products === null || this.products === undefined || this.products.length === 1){
        var nav = new kony.mvc.Navigation(ebbhaAppConstants.frmProduct);
        var productListContext = { productId : this.productId };
        nav.navigate(productListContext);
      }

      var segProducts = this.view.segProducts;
      this.updateProductsListForSaleItems();

      segProducts.widgetDataMap = { "lblTitle" : "name", 
                                   "lblPrice" : "displayPrice", 
                                   "lblRating" : "rating", 
                                   "imgThumbnail" : "imageThumbnail" };
      if(this.searchPage == 1){
        segProducts.setData(this.products);
      }else{
        segProducts.addAll(this.products);
      }
    }
  },
  // this should be done in the post processor, but the java perspective crashes my machine.
  // and there is no documentation to describe the "request" object in the javascript post processor.
  updateProductsListForSaleItems : function() {
    for(var i = 0; i < this.products.length; i++){
      this.products[i].displayPrice = "$" + this.products[i].price;
      this.products[i].imageThumbnail = this.products[i].imageUrls.thumbnail;
      this.products[i].rating = this.products[i].customerReviewAverage;
      if(this.products[i].isOnSale){
        this.products[i].template = "flxProductListSale";
        this.products[i].displayPrice = "$" + this.products[i].salePrice;
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
    //#ifndef android
    // this crashes my galaxy s8
    this.view.segProducts.setAnimations({visible:animationDefObject});
    //#endif
  },
  onReachingEnd : function(){
    if(!this.finalPageReached){
      this.searchPage = this.searchPage + 1;
      this.getProductsBySearchText();
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
       alert("No product Id available!");
       return;
    }

	alert("ProductId: " + selected[0].productId);
    var params = { productId : selected[0].productId };

    var nav = new kony.mvc.Navigation(ebbhaAppConstants.frmProduct);
    nav.navigate(params);
  },
  
});