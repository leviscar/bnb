
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

    setInputControl: function(){
        var self = this;
        // 添加键盘事件监听
        // 有按键按下时，判断是否是方向键，并设置对应方向移动
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function(event){
            switch(event.keyCode) {
                case cc.KEY.a:
                    // 左移
                    console.log("left");
                    break;
                case cc.KEY.d:
                    // 右移
                    console.log("right");
                    break;
                case cc.KEY.w:
                    // 上移
                    console.log("up");
                    break;
                case cc.KEY.s:
                    // 下移
                    console.log("down");
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
