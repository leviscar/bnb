const com = require("Common");

cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.TiledMap
    },
    properties: {

        // 这个属性引用了星星预制资源
        // 主角预制资源
        masterPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 挑战者预制资源
        challengerPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 炸弹预制资源
        bombPrefab: {
            default: null,
            type: cc.Prefab
        },
        _isMapLoaded : {
            default: false,
            serializable: false,
        },
        groundLayerName: {
            default: 'ground'
        },
        blocksLayerName: {
            default: 'blocks'
        },
        giftsLayerName: {
            default: 'gifts'
        },
        barriersLayerName: {
            default: 'barriers'
        },

        player: {
            default: null,
            type: cc.Node
        },
        // 放置炸弹按钮
        bombBtn: {
            default: null,
            type: cc.Button
        }

    },

    onLoad: function(){
        let socket = com.socket;
        let masterPos = cc.p(32*11,32*9);
        let challengerPos = cc.p(32,32);
        let masterRole,challengerRole;
        // let socket = window.io("http://localhost:4000");
        // this._player = this.node.getChildByName("player");
        console.log("game start");
        
        let roleObj = {}
        let bombList = [];

        masterRole= this.spawnNewRole(masterPos,this.masterPrefab);
        challengerRole = this.spawnNewRole(challengerPos,this.challengerPrefab);


        roleObj['master'] = masterRole;
        roleObj['challenger'] = challengerRole;

        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        socket.on("roleInfo",function(data){
            console.log(data[0].name+": "+data[0].position.x +","+data[0].position.y);

            data.forEach(function(val){
                let position = cc.p(val.position.x,val.position.y);
                roleObj[val.name].setPosition(position);
            })

        });
    },

    // LIFE-CYCLE CALLBACKS:
    spawnNewRole: function(pos,prefab) {
        let role = cc.instantiate(prefab);
        this.node.addChild(role);
        role.setPosition(pos);
        return role;
    },
    spawnNewBomb: function(pos,prefab) {
        let bomb = cc.instantiate(prefab);
        this.node.addChild(bomb);
        bomb.setPosition(pos)
        return bomb;
    },
    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {
        let socket = com.socket;
        switch(event.keyCode) {
            case cc.KEY.a:
                console.log('Press a key');
                socket.emit("KeyDown",event.keyCode);
                break;
            case cc.KEY.s:
                console.log('Press s key');
                socket.emit("KeyDown",event.keyCode);
                break;
            case cc.KEY.w:
                console.log('Press w key');
                socket.emit("KeyDown",event.keyCode);
                break;
            case cc.KEY.d:
                console.log('Press d key');
                socket.emit("KeyDown",event.keyCode);
                break;
        }
    },

    onKeyUp: function (event) {
        let socket = com.socket;
        switch(event.keyCode) {
            case cc.KEY.a:
                console.log('release a key');
                socket.emit("KeyUp",event.keyCode);
                break;
            case cc.KEY.s:
                console.log('release s key');
                socket.emit("KeyUp",event.keyCode);
                break;
            case cc.KEY.w:
                console.log('release w key');
                socket.emit("KeyUp",event.keyCode);
                break;
            case cc.KEY.d:
                console.log('release d key');
                socket.emit("KeyUp",event.keyCode);
                break;
        }
    },
    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
