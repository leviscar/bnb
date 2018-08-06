const com = require("../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        editbox: cc.EditBox,
        createBtn:cc.Button
    },

    onLoad: function (){
        this.createBtn.node.on("touchend",this.addRoom,this);
    },

    show: function (){
        this.node.active = true;
        this.node.emit("fade-in");
        
    },

    hide: function (){
        this.node.emit("fade-out");
    },

    addRoom: function (){
        try {
            if(this.editbox.string != ""){
                com.socket.role = "master";
                com.socket.emit("newRoom",{name:this.editbox.string,userInfo:com.userInfo});
                com.roomId = this.editbox.string;
                com.isMaster = true;
            }
        } catch (error){
            console.error(error);
        }
    }
});
