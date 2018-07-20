const com = require("../../../Common");

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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const socket = com.socket;
        const self = this;
        socket.on("end",function () {
            self.show();
        });
    },
    // 显示endGame面板
    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
        // console.log(com.windowSize.width/2);
        this.node.position = cc.p(com.windowSize.width/2,com.windowSize.height/2);
    },
    // 隐藏endGame面板
    hide: function () {
        this.node.active = false;
        this.node.emit('fade-out');
    }
    // update (dt) {},
});
