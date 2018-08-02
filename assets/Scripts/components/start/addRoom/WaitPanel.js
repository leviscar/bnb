const com = require("../../../Common");

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        shareBtn: cc.Button,
        startBtn: cc.Button
    },
    onLoad: function (params) {
        this.shareBtn.node.on('click',this.wxShare,this);
        this.startBtn.node.on('click',this.gameStart,this);
    },

    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
        this.label.string ="等待其他用户连接房间:"+ com.roomId ;
    },
    hide: function (){
        this.node.emit('fade-out');
    },
    
    // 微信分享
    wxShare: function () {
        console.log('share');
        try {
            if(wx){
                var queryString = 'roomName='+com.roomId;
                cc.loader.loadRes('share/share.png',function (err,data) {
                    wx.shareAppMessage({
                        title: '不怕，就来PK',
                        imageUrl: data.url,
                        query: queryString,
                        success(res){
                            console.log('转发成功');
                        },
                        fail(res){
                            console.log('转发失败');
                        }
                    })
                })
            }
        } catch (error) {
            console.error(error)
        }
    },

    // 开始游戏
    gameStart: function () {
        console.log('start');
        try {
            com.socket.emit("startGame");
        } catch (error) {
            console.error(error)
        }
    }

});

