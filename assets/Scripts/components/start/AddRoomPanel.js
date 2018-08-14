const com = require("../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        editbox: cc.EditBox,
        createBtn: cc.Button,
        statusLabel: cc.Label
    },

    onLoad: function (){
        this.createBtn.node.on("touchend",this.addRoom,this);
        this.statusLabel.node.color = cc.Color.RED;
        this.node.on("failed",this.failed,this);
        this.node.on("show",this.show,this);
    },

    show: function (){
        this.node.active = true;
        this.node.emit("fade-in");
        this.statusLabel.string = "";
        cc.find("Canvas/background").pauseSystemEvents(true);
    },

    hide: function (){
        this.node.emit("fade-out");
        this.statusLabel.string = "";
        cc.find("Canvas/background").resumeSystemEvents(true);
    },

    failed: function (){
        this.statusLabel.string = "房间号已存在";
    },

    addRoom: function (){
        try {
            if(this.editbox.string != ""){
                com.socket.emit("newRoom",{name:this.editbox.string,userInfo:com.userInfo});
                com.roomId = this.editbox.string;
            }
        } catch (error){
            console.error(error);
        }
    }
});
