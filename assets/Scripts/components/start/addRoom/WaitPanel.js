const com = require("../../../Common");

module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        shareBtn: cc.Button
    },
    onLoad: function (params) {
        this.shareBtn.node.on('click',this.wxShare,this);
    },

    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
        this.label.string ="等待其他用户连接房间:"+ com.roomId ;
    },
    hide: function (){
        this.node.emit('fade-out');
    },
    wxShare: function () {
        console.log('share');
        try {
            if(wx){
                cc.loader.loadRes('share/share.png',function (err,data) {
                    wx.shareAppMessage({
                        title: '不怕，就来PK',
                        imageUrl: data.url,
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
    }
});

