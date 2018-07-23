let com = require("../../Common");

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
        label: {
            default: null,
            type: cc.Label
        }
    },

    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
        this.label.string ="等待其他用户连接房间:"+ com.roomId ;
    },
    hide: function (){
        this.node.emit('fade-out');
    },
    // LIFE-CYCLE CALLBACKS:
    start () {

    },

    // update (dt) {},
});
