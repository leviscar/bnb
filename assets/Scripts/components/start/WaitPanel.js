const com = require("../../../Common");

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
        // this.loadAvatar = this.loadAvatar.bind(this);

        this.shareBtn.node.on("click",this.wxShare,this);
        this.startBtn.node.on("click",this.gameStart,this);
        this.node.on("loadMasterAvatar",this.loadMasterAvatar,this);
        this.node.on("loadChallengerAvatar",this.loadChallengerAvatar,this);

        const self = this;

        com.socket.on("deleteRoom",function (data){
            console.log("deleteRoom client");
            self.node.emit("fade-out");
            com.userInfos = [];
        });
    },

    hide: function (){
        com.socket.emit("deleteRoom");
    },
    
    // 微信分享
    wxShare: function (){
        console.log("share");
        try {
            if(wx){
                const queryString = "roomName=" + com.roomId;

                cc.loader.loadRes("share/share.png",function (err,data){
                    wx.shareAppMessage({
                        title: "不怕，就来PK",
                        imageUrl: data.url,
                        query: queryString,
                        success (res){
                            console.log("转发成功");
                        },
                        fail (res){
                            console.log("转发失败");
                        }
                    });
                });
            }
        } catch (error){
            console.error(error);
        }
    },

    // 开始游戏
    gameStart: function (){
        console.log("start");
        try {
            com.socket.emit("startGame");
        } catch (error){
            console.error(error);
        }
    },

    // 加载房主头像
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

