var com  = require('Common');

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
        
        NewRoom: cc.Button,
        JoinRoom: cc.Button
    },
    onLoad: function(){
        var socket = window.io("http://localhost:4000");
        com.socket = socket;       

        this.NewRoom.node.on('click',this.newRoom,this);
        this.JoinRoom.node.on('click',this.joinRoom,this);

        // socket.on("roleInfo",function(data){
        //     console.log(data);
        // })
    },
    newRoom: function(event){
        console.log("newRoom");
        com.socket.emit("newRoom",{name:666});
    },
    joinRoom: function(event){
        console.log("joinRoom");
        com.socket.emit("joinRoom",666);
        cc.director.loadScene("map");
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
