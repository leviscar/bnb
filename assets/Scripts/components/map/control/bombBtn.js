const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

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
        try {
            com.socket.emit("KeyDown",com.KeyCode.j);
        } catch (error) {
            console.error(error)
        }
    }

    // update (dt) {},
});
