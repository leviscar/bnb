// 操作杆控制代码
const com = require("../../../Common");

const MoveDirection = cc.Enum({
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
});

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
        updateFlag:  false,

        _touching: false,
        _touchStartPos: null

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
        this._touching = true;
        this._touchStartPos = this.spRoker.node.convertToNodeSpaceAR(event.touch.getLocation());

        this.moveDir = null;
        // console.log("start");
        // this.updateRokerCenterPos(pos);
    },

    onTouchMove: function(event) {
        let touchPos = event.getLocation();
        let pos = this.spRoker.node.convertToNodeSpaceAR(touchPos);
        // 获得外圈的半径
        let radius = this.spRoker.node.width;
        // 获得触摸点和锚点之间的距离
        let distance = cc.pDistance(pos,cc.p(0,0));
        let angle = Math.atan2(pos.x-cc.p(0,0),pos.y-cc.p(0,0)) * (180/Math.PI)

        this.moveCallback(cc.p(pos.x-this._touchStartPos.x,pos.y-this._touchStartPos.y));

        // 当处在圆内时更新操作杆位置
        if(radius>distance){
            this.updateRokerCenterPos(pos);
        }else{
            let x = pos.x*radius/distance;
            let y = pos.y*radius/distance;
            this.updateRokerCenterPos(cc.p(x,y));
        }
        
    },

    onTouchEnd: function(event) {
        this.updateRokerCenterPos(cc.v2(0, 0));

        try {
            com.socket.emit("KeyUp",this.moveDir);
        } catch (error) {
            console.error(error)
        }
        // console.log("end");
        this.moveDir = null;
    },

    onTouchCancel: function(event) {
        this.updateRokerCenterPos(cc.v2(0, 0));

        try {
            com.socket.emit("KeyUp",this.moveDir);
        } catch (error) {
            console.error(error)
        }
        // console.log("cancel");
        this.moveDir = null;
    },

    moveCallback: function(pos) {
        let angle = Math.atan2(pos.y, pos.x) * (180/Math.PI);
        // console.log(angle);
        try {
            com.socket.emit("MoveByAngle",angle);
        } catch (error) {
            console.error(error)
        }
        // this.moveDir = this.getDirection(pos);
    },

    getDirection: function(pos) {
        let x = pos.x;
        let y = pos.y;
        let tanOne = 0.57;
        let tanTwo = 1.73;

        if (tanTwo*x <= y && tanTwo*x > -y) {
            // console.log("up");
            this.slopeFlag = false;
            return com.KeyCode.w;
        }else if(tanOne*x <= y && tanTwo*x >= y){
            // console.log("up&right");
            this.slopeFlag = true;
            return [com.KeyCode.w,com.KeyCode.d];
        }else if (tanTwo*x >= y && tanTwo*x < -y) {
            // console.log("down");
            this.slopeFlag = false;
            return com.KeyCode.s;
        }else if(-tanTwo*x <= y && -tanOne*x >= y){
            // console.log("down&right");
            this.slopeFlag = true;
            return [com.KeyCode.s,com.KeyCode.d];
        }else if (tanOne*x <= y && tanOne*x < -y) {
            // console.log("left");
            this.slopeFlag = false;
            return com.KeyCode.a;
        }else if(tanTwo*x <= y && tanOne*x >= y){
            // console.log("down&left");
            this.slopeFlag = true;
            return [com.KeyCode.s,com.KeyCode.a];
        }else if(-tanOne*x <= y && -tanTwo*x >= y){
            // console.log("up&left");
            this.slopeFlag = true;
            return [com.KeyCode.w,com.KeyCode.a];
        }  
        else {
            // console.log("right");
            this.slopeFlag = false;
            return com.KeyCode.d;
        }
    },

    updateRokerCenterPos: function(pos) {
        this.spRokerCenter.node.setPosition(pos);
        // console.log("back");
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
            // console.log(this.flag);
        }
    }
});