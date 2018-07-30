const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        camera: cc.Camera
    },
    onLoad () {
        // let canvas = cc.find('Canvas').getComponent(cc.Canvas);
        this.visibleSize = cc.view.getVisibleSize();
        // this.initZoomRatio = this.camera.zoomRatio;
        console.log("camera start");
        try {
            this.target = cc.find("map").getChildByName(com.socket.role);
        } catch (error) {
            console.error(error)
        }
    },

    onEnable: function () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);  
    },

    onDisable: function () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);    
    },
    // // 判定角色落在地图的哪个区域
    // transLocate: function (pos) {
    //     let dotLeftUp = {
    //         x: this.visibleSize.width - this.map.x,
    //         y: com.map.basicMap.length*32 - this.visibleSize.height/2 
    //     }
    //     let dotLeftDown = {
    //         x: this.visibleSize.width - this.map.x,
    //         y: this.visibleSize.height/2 
    //     }
    // },
    lateUpdate: function (dt) {
        try {
            let targetPos = this.target.position;
            if(!com.moveMap){
                this.node.position = targetPos;
            }
        } catch (error) {
            console.error(error)
        }

    }
});
