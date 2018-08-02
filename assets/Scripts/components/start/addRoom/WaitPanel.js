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
    onLoad: function () {
        // this.loadAvatar = this.loadAvatar.bind(this);

        this.shareBtn.node.on('click',this.wxShare,this);
        this.startBtn.node.on('click',this.gameStart,this);
        this.node.on('loadMasterAvatar',this.loadAvatar,this);
    },

    hide: function (){
        this.node.emit('fade-out');
    },
    
    // 微信分享
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
    },

    // 开始游戏
    gameStart: function () {
        console.log('start');
        try {
            com.socket.emit("startGame");
        } catch (error) {
            console.error(error)
        }
    },

    // 加载房主头像
    loadAvatar: function () {
        cc.loader.load(com.userInfo.avatarUrl + "?aaa=aa.png", function (err, tex) {
              this.player1.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
              this.player1.getComponent(cc.Sprite).spriteFrame.getTexture().width = 60;
              this.player1.getComponent(cc.Sprite).spriteFrame.getTexture().height = 60;
        });
    }
});

