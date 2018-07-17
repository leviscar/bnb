
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on("click",function () {
            cc.director.loadScene("start");
        },this)
    },

    start () {

    },

    // update (dt) {},
});
