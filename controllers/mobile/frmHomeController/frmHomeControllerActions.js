define({
    /*
      This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    /** onTouchEnd defined for imgSearch **/
    AS_Image_e6bff0dba09447c783bbe895b271c046: function AS_Image_e6bff0dba09447c783bbe895b271c046(eventobject, x, y) {
        var self = this;
        return self.doSearchAnimation.call(this);
    },
    /** onTouchEnd defined for lblCancelSearch **/
    AS_Label_bbfb60fd5c2143c2b08f8fb1b34d8c18: function AS_Label_bbfb60fd5c2143c2b08f8fb1b34d8c18(eventobject, x, y) {
        var self = this;
        return self.doCancelSearchAnimation.call(this);
    },
    /** onDone defined for txtSearchInput **/
    AS_TextField_d068027d23dd47ebb908ced13ad06432: function AS_TextField_d068027d23dd47ebb908ced13ad06432(eventobject, changedtext) {
        var self = this;
        return self.doSearch.call(this);
    },
    /** onRowClick defined for segCategories **/
    AS_Segment_aa965844f19744da8254091d792eaf3b: function AS_Segment_aa965844f19744da8254091d792eaf3b(eventobject, sectionNumber, rowNumber) {
        var self = this;
        return self.segmentSelected.call(this, eventobject, sectionNumber, rowNumber);
    },
    /** init defined for frmHome **/
    AS_Form_f667d38537e14b81bf3a6dc3e6cc372b: function AS_Form_f667d38537e14b81bf3a6dc3e6cc372b(eventobject) {
        var self = this;
        return self.init.call(this);
    },
    /** preShow defined for frmHome **/
    AS_Form_f50c801a2c504233a7f85ed606e4408e: function AS_Form_f50c801a2c504233a7f85ed606e4408e(eventobject) {
        var self = this;
        return self.preshow.call(this);
    },
    /** postShow defined for frmHome **/
    AS_Form_f41bb28bdce94aefa96fb4a6cdd0b818: function AS_Form_f41bb28bdce94aefa96fb4a6cdd0b818(eventobject) {
        var self = this;
        return self.onPostShow.call(this);
    }
});