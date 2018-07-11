
cc.Class({
    extends: cc.Component,

    properties: {
        // 触发距离
        pickRadius:0,
        // 选手移动速度
        moveSpeed: 0,
        // 选手移动步距
        moveStep: 0,
        // 存活状态
        isLive: true
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

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
