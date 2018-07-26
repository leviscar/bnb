const com = require("../../../Common");
cc.Class({
    extends: cc.Component,

    properties: {
        cameraContatiner: cc.Node
    },

    onLoad: function () {
        console.log("movemap");
        console.log(this.cameraContatiner);
        
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },
    onTouchStart: function (event) {
        this.startTouchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.previousPos = this.cameraContatiner.position; 
        com.moveMap = true;
        console.log("start");
        
    },
    onTouchMove: function (event) {
        let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        let changePos = cc.v2(this.previousPos.x+touchPos.x - this.startTouchPos.x,this.previousPos.y+touchPos.y-this.startTouchPos.y);
        this.cameraContatiner.position = cc.v2(changePos.x,changePos.y);
        console.log("move");
        console.log("moveAfter"+this.cameraContatiner.position);
    },
    onTouchEnd: function () {
        console.log("end");
        com.moveMap = false;
    },
    onTouchCancel: function () {
        console.log("cancel");
        com.moveMap = false;
    }


    // update (dt) {},
});
