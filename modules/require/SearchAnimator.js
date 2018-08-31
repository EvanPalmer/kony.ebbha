/*****************************************************************************

 To use this module implement the form with the following layout.
 
 -frmHome
   -flxEverything
     -topNav
     -flxSearchIconBar
       -imgSearchIcon
     -flxBody
       -flxSearchBar
         -btnCancel
         -txtSearchInput
       -flxGrey
       - // form content goes here

*****************************************************************************/

define(function () {

  return {
    animationTimeInSecondsSlow: 1,
    animationTimeInSecondsFast: 0.5,
    hideSearchStuff:function(searchBar, body, greyBox){
      searchBar.isVisible = false;
      searchBar.opacity = 0;
      searchBar.zIndex = 1;
      body.zIndex = 2;
      body.top = 0;
      greyBox.zIndex = 1;
      greyBox.opacity = 0;
    },

    doSearchAnimation:function(searchBar, body, greyBox){
      var self = this;

      // fade (this is not animated in the video)
      searchBar.isVisible = true;
      searchBar.zIndex = 10;
      searchBar.opacity = 1;
      body.zIndex = 50;
      greyBox.zIndex = 10;
      greyBox.opacity = 0.7;
      greyBox.backgroundColor = "85858500";
      
      // slide
      body.animate(
        kony.ui.createAnimation({
          "100": {
            "top": "10%",
            "stepConfig": {
              "timingFunction": kony.anim.EASE
            }
          }
        }), {
          "delay": 0,
          "iterationCount": 1,
          "fillMode": kony.anim.FILL_MODE_FORWARDS,
          "duration": self.animationTimeInSecondsFast
        }, {
          "animationEnd": function(){}
        });
    },

    doCancelSearchAnimation:function(searchBar, body, greyBox){
      var self = this;

      // slide up slowly
      body.animate(
        kony.ui.createAnimation({
          "100": {
            "top": "0%",
            "stepConfig": {
              "timingFunction": kony.anim.EASE
            }
          }
        }), {
          "delay": 0,
          "iterationCount": 1,
          "fillMode": kony.anim.FILL_MODE_FORWARDS,
          "duration": self.animationTimeInSecondsFast
        }, {
          "animationEnd": function(){
            searchBar.animate(
              // do search box fade
              kony.ui.createAnimation({
                "100": {
                  "stepConfig": {
                    "timingFunction": kony.anim.EASE
                  },
                  "opacity": 0
                }
              }), {
                "delay": 0,
                "iterationCount": 1,
                "fillMode": kony.anim.FILL_MODE_FORWARDS,
                "duration": self.animationTimeInSecondsFast
              }, {
                "animationEnd": function(){
                }
              });

            // do grey box fade
            greyBox.animate(
              kony.ui.createAnimation({
                "100": {
                  "stepConfig": {
                    "timingFunction": kony.anim.EASE
                  },
                  "backgroundColor": "85858500",
                  "opacity": 0
                }
              }), {
                "delay": 0,
                "iterationCount": "1",
                "fillMode": kony.anim.FILL_MODE_FORWARDS,
                "duration": self.animationTimeInSecondsFast
              }, {
                "animationEnd": function(){
                  self.hideSearchStuff(searchBar, body, greyBox);
                }
              });
          }
        });
    }
  };

});