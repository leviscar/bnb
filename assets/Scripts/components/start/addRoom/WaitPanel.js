const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        shareBtn: cc.Button
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
        
    },
    onEnable: function () {
        if(wx){
            // cc.loader.loadRes('assets/mapres')
        }
    }
});
