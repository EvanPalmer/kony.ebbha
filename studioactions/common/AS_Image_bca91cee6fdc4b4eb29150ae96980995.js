function AS_Image_bca91cee6fdc4b4eb29150ae96980995(eventobject, x, y) {
    var self = this;

    function MOVE_ACTION____a0f34985efc14196b8debc9ed5298b86_Callback() {}
    self.view.flxSlideDown.animate(
    kony.ui.createAnimation({
        "100": {
            "top": "75dp",
            "stepConfig": {
                "timingFunction": kony.anim.EASE
            }
        }
    }), {
        "delay": 0,
        "iterationCount": 1,
        "fillMode": kony.anim.FILL_MODE_FORWARDS,
        "duration": 1
    }, {
        "animationEnd": MOVE_ACTION____a0f34985efc14196b8debc9ed5298b86_Callback
    });
}