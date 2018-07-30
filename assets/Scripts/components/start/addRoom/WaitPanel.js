const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label
    },

    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
        this.label.string ="等待其他用户连接房间:"+ com.roomId ;
    },
    hide: function (){
        this.node.emit('fade-out');
    }
});
