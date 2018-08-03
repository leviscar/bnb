cc.Class({
    extends: cc.Component,
    onLoad () {
        this.node.on("click",function () {
            cc.director.loadScene("start");
        },this)
    }
});
