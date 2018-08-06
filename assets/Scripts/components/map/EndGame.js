const com = require("../../../Common");

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

        this.socketHandle = this.socketHandle.bind(this);
        this.backStartButton.node.on("click",this.backStart,this);
        this.showOffButton.node.on("click",this.showOff,this);

        try {
            this.socketHandle(self);
        } catch (error){
            console.error(error);
        }
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
            self.resultPanel.string = result;
            self.show();
        });
    },

    /**
     * 炫耀功能
     */
    showOff: function (){
        try {
            if(wx){
                cc.loader.loadRes("share/share.png",function (err,data){
                    wx.shareAppMessage({
                        title: "我在玩泡泡堂",
                        success (res){
                            console.log("炫耀成功");
                        },
                        fail (res){
                            console.log("炫耀失败");
                        }
                    });
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
