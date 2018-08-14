const com = require("../../Common");

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        shareBtn: cc.Button,
        startBtn: cc.Button,
    },

    onLoad: function (){
        const self = this;

        this.shareBtn.node.on("click",this.wxShare,this);
        this.startBtn.node.on("click",this.gameStart,this);
        this.node.on("loadAvatar",this.loadAvatar,this);
        this.node.on("clearAvatar",this.clearAvatar,this);

        com.socket.on("deleteRoom",function (data){
            let isDel = true;

            console.log("deleteRoom client");
            com.userInfos = data.userInfos;
            if (com.userInfos != null)
                com.userInfos.forEach(function (item){
                    if(item != null){
                        if(item.guid && com.userInfo.guid === item.guid){
                            isDel = false;
                        }
                    }
                });
            if(isDel){
                self.node.emit("fade-out");
                com.userInfos = [];
            }else{
                self.node.emit("clearAvatar");
                self.node.emit("loadAvatar");
            }
            
        });
    },

    hide: function (){
        com.socket.emit("deleteRoom");
        cc.find("Canvas/background").resumeSystemEvents(true);
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

    // TODO
    clearAvatar: function (){
        try {
            for(let i = 1; i < 5;i++){
                const tag = "Canvas/waitPanel/player" + i;
    
                cc.find(tag).getComponent(cc.Sprite).spriteFrame = null;
            }
        } catch (error){
            console.error(error);
        }
    },

    loadAvatar: function (){
        try {
            for(let i = 0; i < com.userInfos.length;i++){
                const tag = "Canvas/waitPanel/player" + (i + 1);
    
                if(com.userInfos[i] != null){
                    cc.loader.load(com.userInfos[i].avatarUrl + "?aaa=aa.png", function (err, tex){
                        cc.find(tag).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
                    });
                }
            }
        } catch (error){
            console.error(error);
        }
    }
});

