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
        followX: 0,
        followY: 0,
        minFollowDist: 0,
        followRatio:0
    },
    onLoad () {
        this.startFollow = true;
        let canvas = cc.find('Canvas').getComponent(cc.Canvas);
        this.visibleSize = cc.view.getVisibleSize();
        // this.initZoomRatio = this.camera.zoomRatio;
        console.log("camera start");
        try {
            this.target = cc.find("map").getChildByName(com.socket.role);
        } catch (error) {
            console.error(error)
        }
        // this.target = cc.find("map").getChildByName("challenger");
        this.map = cc.find("map");
        this.map.x = 0;
        this.map.y = 0;



        console.log(this.map.x+","+this.map.y);
        console.log(this.visibleSize)
        // this.map.position = cc.p(0,0) ;

        // if(this.centerAtStart){
        //     this.node.position = this.target.convertToNodeSpaceAR(cc.Vec2.ZERO);
        // }
        // this.previousPos = this.node.position;
    },

    onEnable: function () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);  
    },

    onDisable: function () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);    
    },
    // 判定角色落在地图的哪个区域
    transLocate: function (pos) {
        let dotLeftUp = {
            x: this.visibleSize.width - this.map.x,
            y: com.map.basicMap.length*32 - this.visibleSize.height/2 
        }
        let dotLeftDown = {
            x: this.visibleSize.width - this.map.x,
            y: this.visibleSize.height/2 
        }
    },
    lateUpdate: function (dt) {
        try {
            let targetPos,parentNode;
            parentNode = cc.find("Container/Camera");
            // console.log(parentNode);
            // targetPos = parentNode.convertToWorldSpaceAR(this.target.position);
            targetPos = this.target.position;
            // console.log(targetPos);
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
            } else if(com.moveMap){

            }else{
                // console.log(this.visibleSize.height-this.map.y);
                // if(targetPos.y > (this.visibleSize.height-this.map.y)){
                //     this.node.position = targetPos;
                // };
                // console.log(targetPos-this.map.y-this.visibleSize.height/2);
                // if((targetPos.y+this.map.y <= this.visibleSize.height/2)){
                //     // this.node.position = cc.p(this.visibleSize.width/2-this.map.x,this.visibleSize.height/2-this.map.y);
                //     this.node.position = cc.p(this.visibleSize.width/2-this.map.x,this.visibleSize.height/2-this.map.y)
                // }else if(targetPos.y+this.visibleSize.height/2>=com.map.basicMap.length*32){
                //     console.log( cc.p(this.visibleSize.width/2-this.map.x,com.map.basicMap.length*32-this.visibleSize.height/2));
                //     this.node.position = cc.p(targetPos.x,com.map.basicMap.length*32-this.visibleSize.height/4);
                //     // this.node.position = cc.p(this.visibleSize.width/2-this.map.x,com.map.basicMap.length*32-this.visibleSize.height/4);
                // }else{
                //     this.node.position = targetPos;
                // }
                this.node.position = targetPos;
                
                // this.node.position = targetPos;
            }
    
            this.previousPos = targetPos;
        } catch (error) {
            console.error(error)
        }

    }
});
