const com = require("../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        button: cc.Button,
        itemID: 0
    },

    updateItem: function (roomData){
        this.label.string = roomData.roomName;
        
        if(roomData.isFull){
            this.button.enableAutoGrayEffect = true;
            this.button.interactable = false;
        }else{
            try {
                // TODO
                this.node.on("touchend", function (){
                    com.roomId = roomData.roomName;
                    com.socket.emit("joinRoom",{roomId:roomData.roomName,userInfo:com.userInfo});
                }, this);
            } catch (error){
                console.error(error);
            }
        }
        
    }
});
