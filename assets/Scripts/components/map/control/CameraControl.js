const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        camera: cc.Camera
    },

    onLoad: function (){
        this.visibleSize = cc.view.getVisibleSize();
        this.tmpPos = null;
        this.radio = 0;

        try {
            this.target = cc.find("map").getChildByName(com.userInfo.guid);
        } catch (error){
            console.error(error);
        }
    },

    onEnable: function (){
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);  
    },

    onDisable: function (){
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);    
    },
    
    lateUpdate: function (dt){
        try {
            const targetPos = this.target.position;

            // this.tmpPos = this.node.position;
            // this.radio = com.FPS / 60;
            // this.outPos = this.tmpPos.lerp(targetPos,this.radio); // 线性插值
            if(!com.moveMap){
                this.node.position = targetPos;
            }
        } catch (error){
            console.error(error);
        }

    }
});
