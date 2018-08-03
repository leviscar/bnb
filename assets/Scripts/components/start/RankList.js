cc.Class({
    extends: cc.Component,

    properties: {
        duration: 0,
        rankListPanel: cc.Sprite
    },

    onLoad: function() {
        this.node.active = false;
        this.node.on('fade-in',this.show,this);
    },

    start: function(){
        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;

            window.wx.postMessage({// 发消息给子域
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    },
    
    show: function() {
        this.node.active = !this.node.active;
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankListPanel.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    update() {
        this._updateSubDomainCanvas();
    },
});
