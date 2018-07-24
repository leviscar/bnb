const com = require("../../../Common");
cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        },
        camera: cc.Camera,
        smoothFollow: false,
        centerAtStart: false,
    },
    onLoad () {
        this.startFollow = false;
        let canvas = cc.find('Canvas').getComponent(cc.Canvas);
        this.visibleSize = cc.view.getVisibleSize();
        // this.initZoomRatio = this.camera.zoomRatio;
        console.log("camera start");
        // this.target = cc.find("map").getChildByName(com.socket.role);
        this.target = cc.find("map").getChildByName("challenger");
        this.map = cc.find("map");

        if(this.centerAtStart){
            this.node.position = this.target.convertToNodeSpaceAR(cc.Vec2.ZERO);
        }
        // this.previousPos = this.node.position;
    },

    onEnable: function () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);  
    },

    onDisable: function () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);    
    },
    lateUpdate: function (dt) {
        try {
            let targetPos,parentNode;
            parentNode = cc.find("Container/Camera");
            // console.log(parentNode);
            // targetPos = parentNode.convertToWorldSpaceAR(this.target.position);
            targetPos = this.target.position;
            console.log(targetPos);
            //smooth follow
            if (this.smoothFollow) {
                if (Math.abs(targetPos.x - this.node.x) >= this.followX ||
                    Math.abs(targetPos.y - this.node.y) >= this.followY) {//when camera and target distance is larger than max distance
                    this.startFollow = true;
                }
                if (this.startFollow) {
                    this.node.position = this.node.position.lerp(targetPos,this.followRatio);
                    if (cc.pDistance(targetPos, this.node.position) <= this.minFollowDist) {
                        this.startFollow = false;
                    }
                }
            } else {
                // this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
                this.node.position = targetPos;
                // this.map.position = targetPos;
                // console.log(this.node.position);
            }
    
            this.previousPos = targetPos;
        } catch (error) {
            console.error(error)
        }

    }

    // update (dt) {},
});
