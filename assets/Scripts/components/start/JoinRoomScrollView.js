const com  = require("../../Common");

cc.Class({
    extends: cc.Component,

    properties: {
        totalCount: 0,
        roomId:0,
        spacing: 0, 
        leftSpacing: 0,
        roomPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function (){
        const self = this;

        this.totalCount = 11;
        this.leftSpacing = 20;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.node.active = false;
        this.rooms = []; 
        this.updateRoom.bind(self);
    },
    
    updateRoom: function (data){       
        const content = this.node.getChildByName("view").getChildByName("content");
        const vSpacing = 30;

        this.rooms = [];
        
        content.removeAllChildren();

        for(let i = 0;i < this.totalCount; ++i){
            const room = cc.instantiate(this.roomPrefab);
            const left = (content.width - 3 * room.width) / 4;

            content.addChild(room);
            room.setPosition(left + room.width / 2 - content.width / 2 + (content.width * (i % 3) / 3), -room.height * ( 1.3 + parseInt(i / 3)) - this.spacing * (parseInt(i / 3) + 1));
            room.getComponent("RoomJoinButton").updateItem(data.data[i]);
            this.rooms.push(room);
        } 
    },

    show: function (){
        this.node.active = true;
        this.node.emit("fade-in");
        cc.find("Canvas/background").pauseSystemEvents(true);
    },

    hide: function (){
        this.node.active = false;
        this.node.emit("fade-out");
        cc.find("Canvas/background").resumeSystemEvents(true);
    },

    onEnable: function (){
        try {
            const self = this;

            com.socket.emit("getRooms");
            this.schedule(function (){
                com.socket.emit("getRooms"); 
            }, 1);
            
            com.socket.on("getRooms",function (data){
                self.totalCount = data.data.length;
                self.updateRoom(data);           
            });  
        } catch (error){
            console.error(error);
        }
    }
});
