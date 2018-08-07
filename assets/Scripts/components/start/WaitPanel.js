const com = require("../../Common");

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        shareBtn: cc.Button,
        startBtn: cc.Button,
        player1: cc.Sprite,
        player2: cc.Sprite
    },

    onLoad: function (){
        const self = this;

        this.shareBtn.node.on("click",this.wxShare,this);
        this.startBtn.node.on("click",this.gameStart,this);
        this.node.on("loadMasterAvatar",this.loadMasterAvatar,this);
        this.node.on("loadChallengerAvatar",this.loadChallengerAvatar,this);

        com.socket.on("deleteRoom",function (data){
            console.log("deleteRoom client");
            self.node.emit("fade-out");
            com.userInfos = [];
        });
    },

    hide: function (){
        com.socket.emit("deleteRoom");
    },
    
    wxShare: function (){
        const res = "我在" + com.roomId + "房间等你";

        try {
            if(wx){
                const queryString = "roomName=" + com.roomId;

                wx.shareAppMessage({
                    title: res,
                    imageUrl: com.showImgUrl,
                    query: queryString,
                    success (res){
                        console.log("转发成功");
                    },
                    fail (res){
                        console.log("转发失败");
                    }
                });
            }
        } catch (error){
            console.error(error);
        }
    },

    gameStart: function (){
        console.log("start");
        try {
            com.socket.emit("startGame");
        } catch (error){
            console.error(error);
        }
    },

    loadMasterAvatar: function (){
        cc.loader.load(com.userInfos[0].avatarUrl + "?aaa=aa.png", function (err, tex){
            cc.find("Canvas/waitPanel/player1").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
        });
    },

    loadChallengerAvatar: function (){
        cc.loader.load(com.userInfos[1].avatarUrl + "?aaa=aa.png", function (err, tex){
            cc.find("Canvas/waitPanel/player2").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
        });
    }
});

