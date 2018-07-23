const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        spRoker: cc.Sprite,
        spRokerCenter: cc.Sprite,
        moveSpeed: {
            type: cc.Float,
            default: 1
        },
        slopeFlag: false,
        updateFlag:  false

    },

    onLoad: function () {
        this.getDirection = this.getDirection.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.moveCallback = this.moveCallback.bind(this);

        this.spRoker.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    onTouchStart: function(event) {
        // let touchPos = event.getLocation();
        // let pos = this.spRoker.node.convertToNodeSpaceAR(touchPos);
        // let dir = this.getDirection(pos);
        this.moveDir = null;
        // console.log("start");
        // this.updateRokerCenterPos(pos);
    },

    onTouchMove: function(event) {
        let touchPos = event.getLocation();
        let pos = this.spRoker.node.convertToNodeSpaceAR(touchPos);
        
        this.moveCallback(pos);

        console.log(this.moveDir +":"+this.slopeFlag);
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
    moveCallback: function name(pos) {
        this.moveDir = this.getDirection(pos);
    },

    getDirection: function(pos) {
        let x = pos.x;
        let y = pos.y;
        let tanOne = 0.57;
        let tanTwo = 1.73;

        if (tanTwo*x <= y && tanTwo*x > -y) {
            console.log("up");
            this.slopeFlag = false;
            return com.KeyCode.w;
        }else if(tanOne*x <= y && tanTwo*x >= y){
            console.log("up&right");
            this.slopeFlag = true;
            return [com.KeyCode.w,com.KeyCode.d];
        }else if (tanTwo*x >= y && tanTwo*x < -y) {
            console.log("down");
            this.slopeFlag = false;
            return com.KeyCode.s;
        }else if(-tanTwo*x <= y && -tanOne*x >= y){
            console.log("down&right");
            this.slopeFlag = true;
            return [com.KeyCode.s,com.KeyCode.d];
        }else if (tanOne*x <= y && tanOne*x < -y) {
            console.log("left");
            this.slopeFlag = false;
            return com.KeyCode.a;
        }else if(tanTwo*x <= y && tanOne*x >= y){
            console.log("down&left");
            this.slopeFlag = true;
            return [com.KeyCode.s,com.KeyCode.a];
        }else if(-tanOne*x <= y && -tanTwo*x >= y){
            console.log("up&left");
            this.slopeFlag = true;
            return [com.KeyCode.w,com.KeyCode.a];
        }  
        else {
            console.log("right");
            this.slopeFlag = false;
            return com.KeyCode.d;
        }
    },

    updateRokerCenterPos: function(pos) {
        this.spRokerCenter.node.setPosition(pos);
        console.log("back");
    },
    updateEvent: function() {
        if(this.moveDir === null) return;

        if(this.slopeFlag === false){
            com.socket.emit("KeyDown",this.moveDir);
        }else if(this.slopeFlag === true){
            this.slopeFlag = false;
            if(this.flag){
                com.socket.emit("KeyDown",this.moveDir[0]);
            }else{
                com.socket.emit("KeyDown",this.moveDir[1]);
            }
            this.flag = !this.flag;
            console.log(this.flag);
        }
    },

    update: function(dt) {
        this.updateEvent();
    },
});