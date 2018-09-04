define(function(){
  var breadcrumb = []; 

  return { 
    isGoBack: false,

    init : function() {
      this.view.topNavigation.myBackFormId = ebbhaAppConstants.frmHome;
      this.showNoResults(true, true);
    },

    onNavigate : function(context, isBackNavigation){
	  if(context !== null && context !== undefined && context.isGoBack){
      	this.isGoBack = context.previousForm !== ebbhaAppConstants.frmHome;
      }else{
        this.isGoBack = false;
      }
    },

    preshow : function(){
      var searchAnimator = require("SearchAnimator");
      searchAnimator.hideSearchStuff(this.view.flxSearchBar, this.view.flxBody, this.view.flxGrey);
      this.view.txtSearchInput.text = "";
      this.setAnimation();
      this.view.topNavigation.myBackFormId = this.viewId;
      this.showNoResults(true, true);
    },
    
    onPostShow:function(){
      if(!this.isGoBack){
        ebbhaAppConstants.dismissLoadingScreen();
        var breadcrumbItem = this.popOffBreadcrumbOrNull();
        if(breadcrumbItem === null) this.getTopCategories();
        else this.doBindCategories(breadcrumbItem.data);
      }
    },

    showNoResults:function(results, noResults){
        this.view.lblNoResults.setVisibility(noResults);
        this.view.flxNoResults.setVisibility(noResults);
//        this.view.flxNoResults.height = "100dp";
        this.view.segCategories.setVisibility(results, null);
    },

    doSearchAnimation:function(){
      var searchAnimator = require("SearchAnimator");
      searchAnimator.doSearchAnimation(this.view.flxSearchBar, this.view.flxBody, this.view.flxGrey);
    },

    doCancelSearchAnimation:function(){
      this.view.txtSearchInput.text = "";
      var searchAnimator = require("SearchAnimator");
      searchAnimator.doCancelSearchAnimation(this.view.flxSearchBar, this.view.flxBody, this.view.flxGrey);
    },

    pushToBreadcrumb : function(){
      if(!ebbhaAppConstants.isNullOrEmpty(this.categoryId)) {
        var item = {id : this.categoryId, name : this.categoryName, data : this.categoryData};
        breadcrumb.push(item);
      }

      this.refreshBreadCrumb();
    },

    popOffBreadcrumbOrNull : function(){
      this.categoryId = null;        
      this.categoryName = null;
      this.categoryData = null;

      var poppedItem = null;
      var lastItem = null;
      if(breadcrumb.length > 0){
        poppedItem = breadcrumb.pop(); // give it the old pop-n-ignore
        if(breadcrumb.length > 0)
        {
          lastItem = breadcrumb[breadcrumb.length -1];
          this.categoryId = lastItem.id;        
          this.categoryName = lastItem.name;
          this.categoryData = lastItem.data;
        }
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

      this.view.lblBreadcrumb.text = breadCrumbText;
      if(this.categoryId === null && ebbhaAppConstants.isNullOrEmpty(breadcrumb)){
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
      var topLevelCategoryCache = require("TopLevelCategoryCache");
      var categories = topLevelCategoryCache.getTopLevelCategoriesOrNull();
      if(categories === null)
      {
        ebbhaAppConstants.showLoadingScreen();
        var operationName = "getCategoriesTopLevel";
        var inputParams = {
          "httpheaders": {}};
        mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindCategories);
      }else{
        this.doBindCategories(categories);
      }
    },

    getSubcategories:function(categoryId){
      ebbhaAppConstants.showLoadingScreen();
      var operationName = "getCategoriesByCategory";
      var inputParams = {"categoryId": categoryId,
                         "httpheaders": {}};
      mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindCategories);
    },    

    bindCategories: function(status, response){
      ebbhaAppConstants.dismissLoadingScreen();
      if(response.opstatus > 0)
      {
        alert("ERROR! Retreive Categories unsuccessful. \nStatus" + status + "\nresponse: " + ebbhaAppConstants.ebbhaStringify(response));
        this.view.lblNoResults.centerX = "50%";
        this.view.segCategories.centerX = "200%";
        this.showNoResults(false, true);
      } else {
        this.view.lblNoResults.centerX = "200%";
        this.view.segCategories.centerX = "50%";
        var categories = response.categories;
        kony.print("categories: " + ebbhaAppConstants.ebbhaStringify(categories));

        if(categories === null || categories === undefined || categories.length === 0){
          this.showNoResults(false, true);
          ebbhaAppConstants.showLoadingScreen();
          kony.print("categories was empty! I have to redirect now.");
          var nav = new kony.mvc.Navigation(ebbhaAppConstants.frmProductList);
          var productListContext = { categoryId : this.categoryId, categoryName : this.categoryName };
          nav.navigate(productListContext);
        } else {
          kony.print("Categories was NOT empty! I'll bind some stuff.");
          var segCategories = this.view.segCategories;
          this.pushToBreadcrumb();
          this.doBindCategories(categories);
        }
      }
    },

    doBindCategories:function(data){
      if(breadcrumb.length === 0) {
        var topLevelCategoryCache = require("TopLevelCategoryCache");
        topLevelCategoryCache.setTopLevelCategories(data);
      }
      
      var segCategories = this.view.segCategories;
      segCategories.widgetDataMap = { "lblCategoryName" : "name"};
      segCategories.setData(data);
      this.categoryData = data;
      this.showNoResults(true, false);
    },

    segmentSelected:function(eventObject, sectionNumber, rowNumber){
      kony.print("!!!eventObject: " + ebbhaAppConstants.ebbhaStringify(eventObject));
      var selected = this.view.segCategories.selectedRowItems;

      if(selected === null) selected = eventObject.selecteditems;

      this.categoryId = selected[0].id;
      this.categoryName = selected[0].name;
      this.getSubcategories(this.categoryId);
    },

    doSearch : function(){
      var nav = new kony.mvc.Navigation(ebbhaAppConstants.frmProductList);
      var searchTerm = this.view.txtSearchInput.text;
      if(searchTerm !== null && searchTerm.length > 0)
      {
        nav.navigate({searchTerm : searchTerm});
      } else {
        alert("Please enter some text to search.");
      }
    }

  };
});