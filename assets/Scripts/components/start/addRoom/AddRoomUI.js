const com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        editbox: cc.EditBox,
        createBtn:cc.Button
    },

    onLoad: function () {
        // this.editbox.node.on('text-changed', this.editCallback, this);
        this.createBtn.node.on('touchend',this.addRoom,this);
    },

    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
        
    },

    hide: function (){
        this.node.emit('fade-out');
    },

    // LIFE-CYCLE CALLBACKS:
    editCallback: function () {
        console.log(this.editbox.string);
    },

    addRoom: function () {
        try {
            if(this.editbox.string!=""){
                com.socket.role = 'master';
                com.socket.emit("newRoom",{name:this.editbox.string,userInfo:com.userInfo});
                com.roomId = this.editbox.string;
                this.hide();
            }
        } catch (error) {
            console.error(error)
        }
    }
});
