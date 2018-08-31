define(function () {
    return {
      	timeToCacheInSeconds: 600,
        cacheKeyTimeStamp: "cacheKeyTimeStamp",
      	cacheKeyTopCategories: "cacheKeyTopCategories",
      
        getTopLevelCategoriesOrNull : function() {
          var lastSaveDateString = kony.store.getItem(this.cacheKeyTimeStamp);
          var lastSaveDate = null;
          var lastSaveCategories = null;

          if(lastSaveDate === null || lastSaveDate === undefined){
            lastSaveDate = new Date(lastSaveDateString);
          }
          
          if(lastSaveDate.setSeconds(lastSaveDate.getSeconds() + this.timeToCacheInSeconds) > Date.now()){
            lastSaveCategories = kony.store.getItem(this.cacheKeyTopCategories);
          }
          
          return lastSaveCategories;
        },
      
        setTopLevelCategories : function(categories){
		  kony.store.setItem(this.cacheKeyTimeStamp, Date.now());
		  kony.store.setItem(this.cacheKeyTopCategories, categories);
       	}      
    };
});