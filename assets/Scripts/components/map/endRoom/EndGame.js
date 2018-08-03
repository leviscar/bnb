const com = require("../../../Common");

cc.Class({
    extends: cc.Component,
    properties: {
        resultPanel: cc.Label
    },
    onLoad: function () {
        const socket = com.socket;
        const self = this;
        try {
            socket.on("end",function (data) {
                let result = '';
                if(data.isTied){
                    result = '平局'
                }else{
                    data.winner === com.userInfo.guid ? (result = '你赢了'):(result = '你输了');
                };
                self.resultPanel.string = result;
                self.show();
            });
        } catch (error) {
            console.error(error)
        }
    },

    // 显示endGame面板
    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
        this.node.position = cc.p(com.windowSize.width/2,com.windowSize.height/2);
    },
    
    // 隐藏endGame面板
    hide: function () {
        this.node.active = false;
        this.node.emit('fade-out');
    }
});
