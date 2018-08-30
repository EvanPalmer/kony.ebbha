define(function(){
  var breadcrumb = []; 
  return { 
    categoryId:null,
    categoryName:null,    
    categoryData:null,

    doSearchAnimation:function(){
      var searchAnimator = require("SearchAnimator");
      searchAnimator.doSearchAnimation(this.view.flxSearchBar, this.view.flxBody, this.view.flxGrey);
    },

    doCancelSearchAnimation:function(){
      this.view.txtSearchInput.text = "";
      var searchAnimator = require("SearchAnimator");
      searchAnimator.doCancelSearchAnimation(this.view.flxSearchBar, this.view.flxBody, this.view.flxGrey);
    },

    init : function()
    {
      //      var searchAnimator = require("SearchAnimator");
      //      searchAnimator.hideSearchStuff(this.view.flxSearchBar, this.view.flxBody, this.view.flxGrey);
      this.view.topNavigation.myBackFormId = ebbhaAppConstants.frmHome;
    },

    preshow : function(){
      var searchAnimator = require("SearchAnimator");
      searchAnimator.hideSearchStuff(this.view.flxSearchBar, this.view.flxBody, this.view.flxGrey);
      this.setAnimation();
      this.view.topNavigation.myBackFormId = this.viewId;
    },

    onPostShow:function(){
      ebbhaAppConstants.dismissLoadingScreen();
      var breadcrumbItem = this.popOffBreadcrumbOrNull();
      if(breadcrumbItem === null) this.getTopCategories();
      else this.doBindCategories(breadcrumbItem.data);
    },

    onNavigate : function(context, isBackNavigation){
    },

    pushToBreadcrumb : function(){

      if(!ebbhaAppConstants.isNullOrEmpty(this.categoryId)) {
        var item = {id : this.categoryId, name : this.categoryName, data : this.categoryData};
        breadcrumb.push(item);
      }

      this.refreshBreadCrumb();
    },

    popOffBreadcrumbOrNull : function(){
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
      } else {
        this.categoryId = null;        
        this.categoryName = null;
        this.categoryData = null;
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
          this.categoryData = categories;
          this.pushToBreadcrumb();
          this.doBindCategories(categories);
          ebbhaAppConstants.dismissLoadingScreen();
        }
      }
    },

    doBindCategories:function(data){
      var segCategories = this.view.segCategories;
      segCategories.widgetDataMap = { "lblCategoryName" : "name"};
      segCategories.setData(data);
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
      }else{
        alert("Please enter some text to search.");
      }
    }

  };
});