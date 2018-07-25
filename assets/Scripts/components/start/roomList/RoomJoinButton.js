let com = require("../../../Common");
cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        itemID: 0
    },

    updateItem: function(roomId) {
        // this.itemID = roomId;
        this.label.string = roomId;

        try {
            this.node.on('touchend', function () {
                console.log("Room " + this.itemID + ' clicked');
                com.socket.role = 'challenger';
                com.socket.emit("joinRoom",{roomId:roomId,userInfo:com.userInfo});
            }, this);
        } catch (error) {
            console.error(error)
        }
    }
});
