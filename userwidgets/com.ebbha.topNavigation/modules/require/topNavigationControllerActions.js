define({
    /*
      This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    /** onTouchEnd defined for lblCancelSearch **/
    AS_Label_bfd2b2aabdcf45ccb698f040b0ebe398: function AS_Label_bfd2b2aabdcf45ccb698f040b0ebe398(eventobject, x, y) {
        var self = this;
        return self.doCancel.call(this);
    },
    /** onDone defined for txtSearchInput **/
    AS_TextField_e40d44f6bf1c481cb53dc6919fb22407: function AS_TextField_e40d44f6bf1c481cb53dc6919fb22407(eventobject, changedtext) {
        var self = this;
        return self.doSearch.call(this);
    },
    /** onTouchEnd defined for imgBack **/
    AS_Image_bb2db8fa07dd41b0b54c1c8efaae6d9a: function AS_Image_bb2db8fa07dd41b0b54c1c8efaae6d9a(eventobject, x, y) {
        var self = this;
        return self.goBack.call(this);
    },
    /** onTouchEnd defined for imgSearch **/
    AS_Image_d5e6e0afb4da41e3a6d245a08d2b4bb8: function AS_Image_d5e6e0afb4da41e3a6d245a08d2b4bb8(eventobject, x, y) {
        var self = this;
        return self.animateSearch.call(this, null, null, null);
    }
});