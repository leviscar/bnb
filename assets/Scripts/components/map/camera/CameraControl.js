const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        camera: cc.Camera
    },

    onLoad: function (){
        this.visibleSize = cc.view.getVisibleSize();
        // this.initZoomRatio = this.camera.zoomRatio;
        console.log("camera start");
        try {
            this.target = cc.find("map").getChildByName(com.socket.role);
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

            if(!com.moveMap){
                this.node.position = targetPos;
            }
        } catch (error){
            console.error(error);
        }

    }
});
