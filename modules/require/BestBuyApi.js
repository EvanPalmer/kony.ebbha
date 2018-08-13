define(function () {
  
  var getCategoriesUrl = "https://api.bestbuy.com/v1/categories(id=cat00000)?apiKey=";
  var getProductsForCategoryUrl = "https://api.bestbuy.com/v1/products(categoryPath.id=abcat0902001)?apiKey=YourAPIKey&page=1";
  var getProductsBySearchTextUrl = "http://api.bestbuy.com/v1/products(search=%22hdmi+cable%22)?apiKey=YourAPIKey&page=1";
  var getProductDetailsUrl = "http://api.bestbuy.com/v1/products(productId=1218088854917)?apiKey=YourAPIKey";
  var getUserReviewsForAProductUrl = "http://api.bestbuy.com/v1/reviews(sku=1000671)?apiKey=YourAPIKey";
  
  return {


  };
  
});