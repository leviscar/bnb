const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    onLoad: function (){
        const duration = 0.04;

        this.node.on("touchend",function (){
            const scaleAction = cc.sequence(cc.scaleTo(duration,1.2),cc.scaleTo(duration,1));

            this.node.runAction(scaleAction);
            this.putBomb();
        },this);
    },

    putBomb: function (){
        try {
            com.socket.emit("KeyDown",com.KeyCode.j);
        } catch (error){
            console.error(error);
        }
    }
});
