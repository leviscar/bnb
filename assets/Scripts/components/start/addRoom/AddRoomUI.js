let com = require("../../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        editbox: {
            default: null,
            type: cc.EditBox
        },
        createBtn: {
            default: null,
            type: cc.Button
        }
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
        if(this.editbox.string!=""){
            com.socket.role = 'master';
            com.socket.emit("newRoom",{name:this.editbox.string});
            com.roomId = this.editbox.string;
            this.hide();
        }
    },

    start () {

    },

    // update (dt) {},
});
