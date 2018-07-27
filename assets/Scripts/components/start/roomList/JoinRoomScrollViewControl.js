let com  = require('../../../Common');

cc.Class({
    extends: cc.Component,

    properties: {
        totalCount: 0,
        roomId:0,
        spacing: 0, // spacing between each item
        leftSpacing: 0,
        roomPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    onLoad: function () {
        let self = this;
        this.totalCount=11;
        this.rooms =[];// array to store spawned items
        this.leftSpacing = 20;
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.node.active = false;
        this.updateRoom.bind(self);
    },
    
    updateRoom: function (data) {       
        let content = this.node.getChildByName("view").getChildByName("content");
        let vSpacing = 30;
        // console.log(room);
        // content.addChild(room,1,1001);
        // console.log(data.data[0].roomName);
        content.removeAllChildren();
        this.rooms = [];

        for(let i=0;i<this.totalCount; ++i){
            let room = cc.instantiate(this.roomPrefab);
            // let left = (i%3===0)?this.leftSpacing:0;
            let left = (content.width-3*room.width)/4;
            content.addChild(room);
            room.setPosition(left+room.width/2-content.width/2+(content.width*(i%3)/3), -room.height * ( 1.3 +parseInt(i/3)) - this.spacing * (parseInt(i/3) + 1));
            room.getComponent('RoomJoinButton').updateItem(data.data[i]);
            this.rooms.push(room);
        } 
    },

    // 显示roomlist面板
    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
    },
    // 隐藏roomlist面板
    hide: function () {
        this.node.active = false;
        this.node.emit('fade-out');
    },
    onEnable: function () {
        try {
            let self = this;
            console.log("11111");
            com.socket.emit('getRooms');
            this.schedule(function() {
                // 这里的 this 指向 component
                com.socket.emit('getRooms'); 
            }, 1);
            
            com.socket.on('getRooms',function (data) {
                // console.log(data);
                self.totalCount = data.data.length;
                self.updateRoom(data);           
            });  
        } catch (error) {
            console.error(error)
        }
    }
});
