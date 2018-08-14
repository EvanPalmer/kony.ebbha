define(function(){
  //*****move to constants file
  const serviceName = "BestBuyRoot";
  const ebhaStringify = function (v) {
    const cache = new Map();
    return JSON.stringify(v, function (key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.get(value)) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our map
        cache.set(value, true);
      }
      return value;
    });
  };
  //*****move to constants file
  var breadcrumb = [];

  return{ 

    init : function()
    {
      //this.view.topNavigation.showBackButton = false;
      
      //this.view.topNavigation.myFormId = this.viewId;
      this.setAnimation();
      this.getCategories();
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
      this.view.segCategories.setAnimations({visible:animationDefObject});
    },

    getCategories:function()
    {
      var operationName = "getCategoriesTopLevel";
      var inputParams = {
        "httpheaders": {}};
      mfintegrationsecureinvokerasync(inputParams, serviceName, operationName, this.bindCategories);
    },

    bindCategories: function(status, response){
      if(response.opstatus > 0)
      {
        alert("ERROR! Retreive Categories unsuccessful. \nStatus" + status + "\nresponse: " + JSON.stringify(response));
      } else {
        var categories = response.categories;
        var segCategories = this.view.segCategories;
        segCategories.widgetDataMap = { "lblCategoryName" : "name"};
        segCategories.setData(categories);
      }
    },

    segmentSelected:function(eventObject, sectionNumber, rowNumber){
      kony.print("!!!segmentSelected: " + ebhaStringify(eventObject));
      kony.print("!!!sectionNumber: " + ebhaStringify(sectionNumber));
      kony.print("!!!rowNumber: " + ebhaStringify(rowNumber));
      var categoryId = eventObject.selecteditems[0].id;
      var categoryName = eventObject.selecteditems[0].name;
      this.pushToBreadcrumb(categoryId, categoryName);

      var operationName = "getCategoriesByCategory";
      var inputParams = {"categoryId": categoryId,
                         "httpheaders": {}};
      mfintegrationsecureinvokerasync(inputParams, serviceName, operationName, this.bindCategories);
    }
  };
});