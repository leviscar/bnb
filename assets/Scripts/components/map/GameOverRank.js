cc.Class({
    extends: cc.Component,

    properties: {
        rankingScrollView: cc.Sprite
    },

    start: function (){
        if (CC_WECHATGAME){
            window.wx.showShareMenu({withShareTicket: true});// 设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 1000;
            window.sharedCanvas.height = 300;

            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas (){
        if (window.sharedCanvas != undefined){
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update (){
        this._updateSubDomainCanvas();
    },
  
});
