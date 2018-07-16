// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let com = require("Common");

const keyCode = {
    w: 87,
    a: 65,
    s: 83,
    d: 68
}

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        upBtn: cc.Button,
        downBtn: cc.Button,
        leftBtn: cc.Button,
        rightBtn: cc.Button

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 丑陋的代码，需要重构
        // 上 按键
        this.upBtn.node.on(cc.Node.EventType.TOUCH_START,function(){
            console.log('up pressed');
            com.socket.emit('KeyDown',keyCode.w);

        });
        this.upBtn.node.on(cc.Node.EventType.TOUCH_END,function(){
            console.log('up end');
            com.socket.emit('KeyUp',keyCode.w);
        });

        // 下 按键
        this.downBtn.node.on(cc.Node.EventType.TOUCH_START,function(){
            console.log('downBtn pressed');
            com.socket.emit('KeyDown',keyCode.s);

        });
        this.downBtn.node.on(cc.Node.EventType.TOUCH_END,function(){
            console.log('downBtn end');
            com.socket.emit('KeyUp',keyCode.s);
        });

        // 左 按键
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_START,function(){
            console.log('leftBtn pressed');
            com.socket.emit('KeyDown',keyCode.a);

        });
        this.leftBtn.node.on(cc.Node.EventType.TOUCH_END,function(){
            console.log('leftBtn end');
            com.socket.emit('KeyUp',keyCode.a);
        });

        // 右 按键
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_START,function(){
            console.log('rightBtn pressed');
            com.socket.emit('KeyDown',keyCode.d);

        });
        this.rightBtn.node.on(cc.Node.EventType.TOUCH_END,function(){
            console.log('rightBtn end');
            com.socket.emit('KeyUp',keyCode.d);
        });

    },

    start () {

    },

    // update (dt) {},
});
