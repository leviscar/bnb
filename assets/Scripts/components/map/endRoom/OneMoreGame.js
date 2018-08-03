const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    onLoad () {
        this.node.on("click",function () {
            com.socket.emit('playAgain',{userInfo:com.userInfo});
        },this)
    }
});