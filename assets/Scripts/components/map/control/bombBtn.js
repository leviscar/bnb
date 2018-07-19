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
        let duration = 0.04;
        this.node.on("touchend",function () {
            let scaleAction = cc.sequence(cc.scaleTo(duration,1.2),cc.scaleTo(duration,1));
            this.node.runAction(scaleAction);
            this.putBomb();
        },this)
    },
    putBomb: function () {
        console.log("bomd down");
        com.socket.emit("KeyDown",com.KeyCode.j);
    },

    start () {

    },

    // update (dt) {},
});
