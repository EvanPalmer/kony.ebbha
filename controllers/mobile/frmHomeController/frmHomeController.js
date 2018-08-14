define(function(){
  return{ 
    init : function()
    {
      //this.view.topNavigation.showBackButton = false;
      //this.view.topNavigation.myFormId = "frmHome";
      this.getCategories();
    },
    getCategories:function()
    {
      var serviceName = "BestBuyRoot";
      var operationName = "getCategoriesTopLevel";
      var inputParams = {
        "httpheaders": {}};
      mfintegrationsecureinvokerasync(inputParams, serviceName, operationName, bindCategories.bind(this));

      function bindCategories(status, response){
        if(response.opstatus > 0)
        {
          alert("ERROR! Retreive Categories unsuccessful. \nStatus" + status + "\nresponse: " + JSON.stringify(response));
        } else {
          var categories = response.categories;
          var segCategories = this.view.segCategories;
          segCategories.widgetDataMap = { "lblCategoryName" : "name"};
          segCategories.setData(categories);
        }
      }
    },
  };
});