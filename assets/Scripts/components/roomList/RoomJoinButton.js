let com = require("../../Common");
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        itemID: 0
    },
    onLoad: function () {
        // this.label.string = "hello";
        // this.node.on('touchend', function () {
        //     console.log("Room " + this.itemID + ' clicked');
        //     com.socket.role = 'challenger';
        //     com.socket.emit("joinRoom",666);
        // }, this);
    },

    updateItem: function(roomId) {
        // this.itemID = roomId;
        this.label.string = roomId;

        this.node.on('touchend', function () {
            console.log("Room " + this.itemID + ' clicked');
            com.socket.role = 'challenger';
            com.socket.emit("joinRoom",roomId);
        }, this);
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
