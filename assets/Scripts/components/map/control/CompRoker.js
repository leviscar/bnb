const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        spRoker: cc.Sprite,
        spRokerCenter: cc.Sprite,
        updateFlag:  false,
        touching: false,
        touchStartPos: null

    },

    onLoad: function (){
        this.moveCallback = this.moveCallback.bind(this);

        this.spRoker.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.spRoker.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    onTouchStart: function (event){
        this.touching = true;
        this.touchStartPos = this.spRoker.node.convertToNodeSpaceAR(event.touch.getLocation());
        this.moveDir = null;
    },

    onTouchMove: function (event){
        const touchPos = event.getLocation();
        const pos = this.spRoker.node.convertToNodeSpaceAR(touchPos);
        // 获得外圈的半径
        const radius = this.spRoker.node.width;
        // 获得触摸点和锚点之间的距离
        const distance = cc.pDistance(pos,cc.p(0,0));
        const angle = Math.atan2(pos.x - cc.p(0,0),pos.y - cc.p(0,0)) * (180 / Math.PI);

        this.moveCallback(cc.p(pos.x - this.touchStartPos.x,pos.y - this.touchStartPos.y));

        // 当处在圆内时更新操作杆位置
        if(radius > distance){
            this.updateRokerCenterPos(pos);
        }else{
            const x = pos.x * radius / distance;
            const y = pos.y * radius / distance;

            this.updateRokerCenterPos(cc.p(x,y));
        }
        
    },

    onTouchEnd: function (event){
        this.updateRokerCenterPos(cc.v2(0, 0));

        try {
            com.socket.emit("TouchEnd");
        } catch (error){
            console.error(error);
        }
        this.moveDir = null;
    },

    onTouchCancel: function (event){
        this.updateRokerCenterPos(cc.v2(0, 0));

        try {
            com.socket.emit("TouchEnd");
        } catch (error){
            console.error(error);
        }
        this.moveDir = null;
    },

    moveCallback: function (pos){
        const angle = Math.atan2(pos.y, pos.x) * (180 / Math.PI);

        try {
            com.socket.emit("MoveByAngle",angle);
        } catch (error){
            console.error(error);
        }
    },

    updateRokerCenterPos: function (pos){
        this.spRokerCenter.node.setPosition(pos);
    }
});