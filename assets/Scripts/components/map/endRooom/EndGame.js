const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const socket = com.socket;
        const self = this;
        try {
            socket.on("end",function () {
                self.show();
            });
        } catch (error) {
            console.error(error)
        }
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
