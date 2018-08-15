define(function(){
  var breadcrumb = []; 
  return{ 
    categoryId:null,
    categoryName:null,    

    init : function()
    {
      this.setAnimation();
      this.getTopCategories();
    },
    
    preshow : function(){
	  this.view.topNavigation.myBackFormId = this.viewId;
      this.view.topNavigation.showBackButton = false;
    },
	
    onNavigate : function(context, isBackNavigation){
      var breadcrumbItem = this.popOffBreadcrumbOrNull();
      if(breadcrumbItem === null) this.getTopCategories();
      else this.getSubcategories(breadcrumbItem.id);
    },

    pushToBreadcrumb : function(id, name){
      var item = {id : id, name : name};
      breadcrumb.push(item);
      this.refreshBreadCrumb();
    },

    popOffBreadcrumbOrNull : function(){
      if(breadcrumb.length > 0){
        var lastItem = breadcrumb.pop();
        this.refreshBreadCrumb();
        return lastItem;
      }
      return null;
    },

    refreshBreadCrumb : function(){
      var home = "home";
      var arrow = " > ";
      var breadCrumbText = home;
      for(var i = 0; i < breadcrumb.length; i++){
        breadCrumbText = breadCrumbText + arrow + breadcrumb[i].name;
      }
      this.view.lblBreadcrumb.text = breadCrumbText;
    },

    setAnimation : function(){
      var transformObject1 = kony.ui.makeAffineTransform();
      var transformObject2 = kony.ui.makeAffineTransform();
      var animationType = "translate";

      if(animationType=="translate"){
        transformObject1.translate(200, 0);
        transformObject2.translate(0, 0);
      }
      else if(animationType=="scale"){
        transformObject1.scale(0,0);
        transformObject2.scale(1,1);
      }
      else if(animationType=="rotate"){
        transformObject1.rotate(90);
        transformObject2.rotate(0);
      } 
      var animationObject = kony.ui.createAnimation(
        {"0":{"transform":transformObject1,"stepConfig":{"timingFunction":kony.anim.LINEAR}},
         "100":{"transform":transformObject2,"stepConfig":{"timingFunction":kony.anim.LINEAR}}});
      var animationConfig = {
        duration: 1,
        fillMode: kony.anim.FILL_MODE_FORWARDS
      };
      var animationCallbacks = {"animationEnd":function(){kony.print("animation END");}};
      var animationDefObject={definition:animationObject,config:animationConfig,callbacks:animationCallbacks};
	//#ifndef android
      // this crashes my galaxy s8
      this.view.segCategories.setAnimations({visible:animationDefObject});
    //#endif
    },

    getTopCategories:function()
    {
      var operationName = "getCategoriesTopLevel";
      var inputParams = {
        "httpheaders": {}};
      mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindCategories);
    },

    bindCategories: function(status, response){
      if(response.opstatus > 0)
      {
        alert("ERROR! Retreive Categories unsuccessful. \nStatus" + status + "\nresponse: " + ebbhaAppConstants.ebbhaStringify(response));
      } else {
        var categories = response.categories;
		
        if(categories === null || categories === undefined || categories.length === 0){
          var nav = new kony.mvc.Navigation(ebbhaAppConstants.frmProductList);
          var productListContext = { categoryId : this.categoryId, categoryName : this.categoryName };
          nav.navigate(productListContext);
        }
        
        var segCategories = this.view.segCategories;
        segCategories.widgetDataMap = { "lblCategoryName" : "name"};
        segCategories.setData(categories);
      }
    },

    segmentSelected:function(eventObject, sectionNumber, rowNumber){
      kony.print("!!!eventObject: " + ebbhaAppConstants.ebbhaStringify(eventObject));
      var selected = this.view.segCategories.selectedRowItems;
      
      if(selected === null) selected = eventObject.selecteditems;
      
      this.categoryId = selected[0].id;
      this.categoryName = selected[0].name;
      this.pushToBreadcrumb(this.categoryId, this.categoryName);
      this.getSubcategories(this.categoryId);
    },
    
    getSubcategories:function(categoryId){
      var operationName = "getCategoriesByCategory";
      var inputParams = {"categoryId": categoryId,
                         "httpheaders": {}};
      mfintegrationsecureinvokerasync(inputParams, ebbhaAppConstants.serviceName, operationName, this.bindCategories);
    }
    
  };
});