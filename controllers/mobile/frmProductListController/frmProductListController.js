define({ 
    categoryName:null,
  	categoryId:null,
    onNavigate : function(context, isBackNavigation){
    	alert(context);
        this.categoryId = context.categoryId;        
        this.categoryName = context.categoryName;

    }

 });