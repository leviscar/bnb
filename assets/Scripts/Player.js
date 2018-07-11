var com = require("Common");

var MoveDirection = cc.Enum({
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
});

cc.Class({
    extends: cc.Component,

    properties: {
        // 选手移动速度
        moveSpeed: 0,
        // 选手移动步距
        moveStep: 32,
        // 存活状态
        isLive: true
    },

    moveAction: function(direct){
        switch(direct){
            case MoveDirection.UP:
            console.log("up");
            break;
            case MoveDirection.LEFT:
            console.log("left");
            break;
            case MoveDirection.RIGHT:
            console.log("right");
            break;
            case MoveDirection.DOWN:
            console.log("down");
            break;
        }
    },

    setInputControl: function(){
        var self = this;
        // 添加键盘事件监听
        // 有按键按下时，判断是否是方向键，并设置对应方向移动
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(event){
            switch(event.keyCode) {
                case cc.KEY.a:
                    // 左移
                    this.moveAction(MoveDirection.LEFT);
                    break;
                case cc.KEY.d:
                    // 右移
                    this.moveAction(MoveDirection.RIGHT);
                    break;
                case cc.KEY.w:
                    // 上移
                    this.moveAction(MoveDirection.UP);
                    break;
                case cc.KEY.s:
                    // 下移
                    this.moveAction(MoveDirection.DOWN);
                    break;
            }
        });

        // 松开按键时，停止向该方向的移动
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event){
            switch(event.keyCode) {
                case cc.KEY.a:
                    // 左移
                    break;
                case cc.KEY.d:
                    // 右移
                    break;
                case cc.KEY.w:
                    // 上移
                    break;
                case cc.KEY.s:
                    // 下移
                    break;
            }
        });
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onLoad: function(){

        // 初始化移动速度
        this.moveSpeed = 1;

        // 初始化键盘监听事件
        this.setInputControl();
        // var self = this;
        // var socket = com.socket;

        // socket.on("roleInfo",function(data){
        //     var obj = data[1].position;
        //     console.log(obj.x);
        //     // this.node.x = obj.x;
        //     // this.node.y = obj.y;
        //     var seq = cc.moveTo(0.2,obj.x,obj.y);
        //     self.node.runAction(seq);
            
        // })
    },

    move: function(obj){
        this.node.x = obj.x;
        this.node.y = obj.y;
    },

    update: function(){
        // 根据当前速度更新主角的位置
        // if(this.node.x <= 960){
        //     this.node.x += this.moveStep;
        // }else{
        //     this.node.x=0;
        // }
        
    },

    start () {

    },

    // update (dt) {},
});
