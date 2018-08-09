const com = require("../../Common");

cc.Class({
    extends: cc.Component,
    
    properties: {
        resultPanel: cc.Label,
        oneMoreButton: cc.Button,
        backStartButton: cc.Button,
        showOffButton: cc.Button
    },

    onLoad: function (){
        const self = this;

        this.winnerGuid = null;
        this.socketHandle = this.socketHandle.bind(this);
        this.backStartButton.node.on("click",this.backStart,this);
        this.showOffButton.node.on("click",this.showOff,this);
        this.oneMoreButton.node.on("click",this.playAgain,this);
        
        try {
            this.socketHandle(self);
        } catch (error){
            console.error(error);
        }
    },

    playAgain: function (){
        com.socket.emit("playAgain",{roomId:com.roomId, userInfo:com.userInfo});
    },

    /**
     * 显示endGame面板
     */
    show: function (){
        this.node.active = true;
        this.node.emit("fade-in");
        this.node.position = cc.p(com.windowSize.width / 2,com.windowSize.height / 2);
    },
    
    /**
     * 隐藏endGame面板
     */
    hide: function (){
        this.node.active = false;
        this.node.emit("fade-out");
    },

    /**
     * socket handle
     */
    socketHandle: function (self){
        com.socket.on("end",function (data){
            let result = "";

            if(data.isTied){
                result = "平局";
            }else{
                data.winner === com.userInfo.guid ? (result = "你赢了") : (result = "你输了");
            }
            self.winnerGuid = data.winner;
            if(data.winner === com.userInfo.guid){
                com.isWinner = true;
            }
            self.resultPanel.string = result;
            self.show();
        });
    },

    /**
     * 炫耀功能
     */
    showOff: function (){
        let res = "";

        if(com.userInfos.length < 2){
            res = "我在玩泡泡堂";
        }else if(this.winnerGuid === com.userInfos[0].guid){
            res = com.userInfos[0].nickName + " 战胜了 " + com.userInfos[1].nickName;
        }else{
            res = com.userInfos[1].nickName + " 战胜了 " + com.userInfos[0].nickName;
        }

        try {
            if(wx){
                wx.shareAppMessage({
                    title: res,
                    imageUrl: com.showImgUrl,
                    success (res){
                        console.log("炫耀成功");
                    },
                    fail (res){
                        console.log("炫耀失败");
                    }
                });
            }
        } catch (error){
            console.error(error);
        }
    },

    /**
     * 返回大厅
     */
    backStart: function (){
        cc.director.loadScene("start");
    }

});
