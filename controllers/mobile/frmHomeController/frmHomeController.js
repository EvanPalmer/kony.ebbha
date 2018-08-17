define(function(){
  var breadcrumb = []; 
  return { 
    categoryId:null,
    categoryName:null,    

    init : function()
    {
    },
    
    preshow : function(){
      this.setAnimation();
      this.view.topNavigation.myBackFormId = this.viewId;
    },
	
    onPostShow:function(){
      ebbhaAppConstants.dismissLoadingScreen();
      this.getTopCategories();
      this.refreshBreadCrumb();
    },
    
    onNavigate : function(context, isBackNavigation){
      ebbhaAppConstants.showLoadingScreen();
      var breadcrumbItem = this.popOffBreadcrumbOrNull();
      if(breadcrumbItem === null) this.getTopCategories();
      else this.getSubcategories(breadcrumbItem.id);
    },

    pushToBreadcrumb : function(categoryId, categoryName){
      
      if(!ebbhaAppConstants.isNullOrEmpty(this.categoryId) && ebbhaAppConstants.bestBuy !== this.categoryName) {
        var item = {id : this.categoryId, name : this.categoryName};
        breadcrumb.push(item);
      }
      
      this.categoryId = categoryId;
      this.categoryName = categoryName;
      this.refreshBreadCrumb();
    },

    popOffBreadcrumbOrNull : function(){
      var lastItem = null;
      if(breadcrumb.length > 0){
        lastItem = breadcrumb.pop();
        this.categoryId = lastItem.id;        
        this.categoryName = lastItem.name;
      } else {
        this.categoryId = null;        
        this.categoryName = null;
      }
      this.refreshBreadCrumb();
      return lastItem;
    },

    refreshBreadCrumb : function(){
      var home = "home";
      var arrow = " > ";
      var breadCrumbText = home;
      for(var i = 0; i < breadcrumb.length; i++){
        breadCrumbText = breadCrumbText + arrow + breadcrumb[i].name;
      }
      if(!ebbhaAppConstants.isNullOrUndefined(this.categoryName) && ebbhaAppConstants.bestBuy !== this.categoryName){
        breadCrumbText = breadCrumbText + arrow + this.categoryName;
      }
      this.view.lblBreadcrumb.text = breadCrumbText;
      if((this.categoryId === null || ebbhaAppConstants.bestBuy === this.categoryName) && ebbhaAppConstants.isNullOrEmpty(breadcrumb)){
        this.view.topNavigation.showGoBackButton = false;
      }else{
        this.view.topNavigation.showGoBackButton = true;
      }
    },

    setAnimation : function(){
      var startTrans = kony.ui.makeAffineTransform();
      var endTrans = kony.ui.makeAffineTransform();

      startTrans.translate(200, 0);
      endTrans.translate(0, 0);

      var animationObject = kony.ui.createAnimation(
        {"0":{"transform":startTrans,"stepConfig":{"timingFunction":kony.anim.LINEAR}},
         "100":{"transform":endTrans,"stepConfig":{"timingFunction":kony.anim.LINEAR}}});
      
      var animationConfig = {
        duration: 1,
        fillMode: kony.anim.FILL_MODE_FORWARDS
      };
      
      var animationCallbacks = {"animationEnd":function(){kony.print("animation END");}};
      var animationDefObject={definition:animationObject,config:animationConfig,callbacks:animationCallbacks};
      this.view.segCategories.setAnimations({visible:animationDefObject});
    },

    getTopCategories:function()
    {
      ebbhaAppConstants.showLoadingScreen();
      var operationName = "getCategoriesTopLevel";
      var inputParams = {
        "httpheaders": {}};
      mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindCategories);
    },

    getSubcategories:function(categoryId){
      ebbhaAppConstants.showLoadingScreen();
      var operationName = "getCategoriesByCategory";
      var inputParams = {"categoryId": categoryId,
                         "httpheaders": {}};
      mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindCategories);
    },    
    
    bindCategories: function(status, response){
      if(response.opstatus > 0)
      {
        alert("ERROR! Retreive Categories unsuccessful. \nStatus" + status + "\nresponse: " + ebbhaAppConstants.ebbhaStringify(response));
      } else {
        var categories = response.categories;
        this.pushToBreadcrumb(response.currentCategoryId, response.currentCategoryName);
		kony.print("categories: " + ebbhaAppConstants.ebbhaStringify(categories));
        
        if(categories === null || categories === undefined || categories.length === 0){
          kony.print("categories was empty! I have to redirect now.");
		  var nav = new kony.mvc.Navigation(ebbhaAppConstants.frmProductList);
          var productListContext = { categoryId : this.categoryId, categoryName : this.categoryName };
	      ebbhaAppConstants.showLoadingScreen();
          nav.navigate(productListContext);
        } else {
          kony.print("Categories was NOT empty! I'll bind some stuff.");
          var segCategories = this.view.segCategories;
          segCategories.widgetDataMap = { "lblCategoryName" : "name"};
          segCategories.setData(categories);
          ebbhaAppConstants.dismissLoadingScreen();
        }
      }
    },

    segmentSelected:function(eventObject, sectionNumber, rowNumber){
      kony.print("!!!eventObject: " + ebbhaAppConstants.ebbhaStringify(eventObject));
      var selected = this.view.segCategories.selectedRowItems;
      
      if(selected === null) selected = eventObject.selecteditems;
      var categoryId = selected[0].id;
      var categoryName = selected[0].name;
      this.getSubcategories(categoryId);
    },
   
  };
});