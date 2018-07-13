cc.Class({
    extends: cc.Component,

    properties: {
        totalCount: 0,
        roomId:0,
        spacing: 0, // spacing between each item
        roomPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    onLoad: function () {
        this.totalCount=11;
        this.rooms =[];// array to store spawned items
        this.initialize();
        this.updateTimer = 0;
        this.updateInterval = 0.2;
    },
    
    initialize: function () {
        
        let content = this.node.getChildByName("view").getChildByName("content");

        // console.log(content);
        // console.log(room);

        // content.addChild(room,1,1001);
        for(let i=0;i<this.totalCount; ++i){
            let room = cc.instantiate(this.roomPrefab);
            content.addChild(room);
            room.setPosition(-200, -room.height * (0.5 + i) - this.spacing * (i + 1));
            this.rooms.push(room);
        }
    },

    start () {

    },

    // update (dt) {},
})