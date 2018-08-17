const ebbhaAppConstants = {
  	frmHome : "frmHome",
    frmProduct : "frmProduct",
	frmProductList : "frmProductList",
    serviceName : "BestBuyRoot",
    bestBuy: "Best Buy",
    ebbhaStringify : function (v) {
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
  	},
  
    isNullOrEmpty : function(value){
      return value === null || value === undefined || value.length === 0;
    },
  
    isNullOrUndefined : function(value){
      return value === null || value === undefined;
    },
  
  	showLoadingScreen : function(){
      kony.application.showLoadingScreen(null, "loading", constants.LOADING_SCREEN_POSITION_FULL_SCREEN, true, false, null);
    },
  
  	dismissLoadingScreen : function(){
      kony.application.dismissLoadingScreen();
    }
};