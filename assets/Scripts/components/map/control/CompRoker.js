const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        spRoker: cc.Sprite,
        spRokerCenter: cc.Sprite,
        moveSpeed: {
            type: cc.Float,
            default: 1
        }
    },

    onLoad: function () {
        this.spRoker.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    // onTouchStart: function(event) {
    //     let touchPos = event.getLocation();
    //     let pos = this.spRoker.node.convertToNodeSpaceAR(touchPos);
    //     let dir = this.getDirection(pos);
    //     this.moveDir = this.getDirection(pos);
    //     // console.log("start");
    //     this.updateRokerCenterPos(pos);
    // },

    onTouchMove: function(event) {
        let touchPos = event.getLocation();
        let pos = this.spRoker.node.convertToNodeSpaceAR(touchPos);
        this.moveDir = this.getDirection(pos);
        // console.log("move");
        this.updateRokerCenterPos(pos);
    },

    onTouchEnd: function(event) {
        this.updateRokerCenterPos(cc.v2(0, 0));
        com.socket.emit("KeyUp",this.moveDir);
        // console.log("end");
        this.moveDir = null;
    },

    onTouchCancel: function(event) {
        this.updateRokerCenterPos(cc.v2(0, 0));
        com.socket.emit("KeyUp",this.moveDir);
        // console.log("cancel");
        this.moveDir = null;
    },

    getDirection: function(pos) {
        let x = pos.x;
        let y = pos.y;
        if (x <= y && x > -y) {
            com.socket.emit("KeyDown",com.KeyCode.w);
            console.log("up");
            return com.KeyCode.w;
            // return cc.v2(0, 1);// 上
        } else if (x >= y && x < -y) {
            com.socket.emit("KeyDown",com.KeyCode.s);
            console.log("down");
            return com.KeyCode.s;
            // return cc.v2(0, -1);// 下
        } else if (x <= y && x < -y) {
            com.socket.emit("KeyDown",com.KeyCode.a);
            console.log("left");
            return com.KeyCode.a;
            // return cc.v2(-1, 0);// 左
        } else {
            com.socket.emit("KeyDown",com.KeyCode.d);
            console.log("right");
            // return cc.v2(1, 0);// 右
            return com.KeyCode.d;
        }
    },

    updateRokerCenterPos: function(pos) {
        this.spRokerCenter.node.setPosition(pos);
        console.log("back");
    },

    updatePlayerPos: function(dir) {
        this.spPlayer.node.x += dir.x * this.moveSpeed;
        this.spPlayer.node.y += dir.y * this.moveSpeed;
    },

    update: function(dt) {
        // if (this.moveDir) {
        //     this.updatePlayerPos(this.moveDir);
        // }
    },
});