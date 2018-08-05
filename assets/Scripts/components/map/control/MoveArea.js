const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        cameraContatiner: cc.Node
    },

    onLoad: function (){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    onTouchStart: function (event){
        this.startTouchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.previousPos = this.cameraContatiner.position; 
        com.moveMap = true;
    },

    onTouchMove: function (event){
        const touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        const changePos = cc.v2(this.previousPos.x + touchPos.x - this.startTouchPos.x,this.previousPos.y + touchPos.y - this.startTouchPos.y);

        this.cameraContatiner.position = cc.v2(changePos.x,changePos.y);
    },

    onTouchEnd: function (){
        com.moveMap = false;
    },

    onTouchCancel: function (){
        com.moveMap = false;
    }
});
