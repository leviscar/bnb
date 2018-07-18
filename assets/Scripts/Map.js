const com = require("Common");

const GROUND       = 10;

const NG_W_1  = 1;
const NG_W_2  = 2;
const G_W  = 3;

const S_W_1 = 11;
const S_W_2 = 12;
const S_W_3 = 13;

const PAOPAO       = 100;

const I_PAOPAO = 101;
const I_SPEED  = 102;
const I_POWER  = 103;
const I_SCORE  = 104;


let backGroundMap = [ 
        [  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1 ], 
        [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND,  S_W_1 ],
        [  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, NG_W_1,  S_W_1, GROUND,  S_W_1 ],
        [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, NG_W_1, GROUND,  S_W_1 ],
        [  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1 ],
        [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND,  S_W_1 ],
        [  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1 ],
        [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND,  S_W_1 ],
        [  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1 ],
        [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND,  S_W_1 ],
        [  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1 ]
     ];


cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.TiledMap
    },
    properties: {

        // 这个属性引用了星星预制资源
        // 主角预制资源
        masterPrefab: cc.Prefab,
        // 挑战者预制资源
        challengerPrefab: cc.Prefab,
        // 炸弹预制资源
        bombPrefab: cc.Prefab,
        // 地面预制资源
        groudPrefab: cc.Prefab,
        // 墙预制资源
        blockPrefab: cc.Prefab,
        // 障碍物预制资源
        barrierPrefab: cc.Prefab,
        // 加速道具预制资源
        speedPrefab: cc.Prefab,
        // 增加炸弹道具
        addBombPrefab: cc.Prefab,
        // 增加威力预制道具
        strengthPrefab: cc.Prefab,
        


        player:  cc.Node,
        // 放置炸弹按钮
        bombBtn: cc.Button,
        mapItemX: 0,
        mapItemY: 0

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

        // this.drawMapBG.call(this);
        this.drawMapBG = this.drawMapBG.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.spawnNewItem = this.spawnNewItem.bind(this);

        this.mapItemX = 32;
        this.mapItemY = 32;

        this.drawMapBG(backGroundMap);
        this.drawMap(backGroundMap);

        masterRole= this.spawnNewRole(masterPos,this.masterPrefab);
        challengerRole = this.spawnNewRole(challengerPos,this.challengerPrefab);


        roleObj['master'] = masterRole;
        roleObj['challenger'] = challengerRole;

        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // this.drawMap.call(this);
        
        socket.on("roleInfo",function(data){
            console.log(data[0].name+": "+data[0].position.x +","+data[0].position.y);

            data.forEach(function(val){
                let position = cc.p(val.position.x,val.position.y);
                roleObj[val.name].setPosition(position);
            })

        });
    },

    // LIFE-CYCLE CALLBACKS:
    // 在地图上生成新角色
    spawnNewRole: function(pos,prefab) {
        let role = cc.instantiate(prefab);
        this.node.addChild(role);
        role.setPosition(pos);
        return role;
    },
    // 在地图上生成新炸弹
    spawnNewBomb: function(pos,prefab) {
        let bomb = cc.instantiate(prefab);
        this.node.addChild(bomb);
        bomb.setPosition(pos)
        return bomb;
    },
    // 在地图上生成新item
    spawnNewItem: function(pos,prefab) {
        let item = cc.instantiate(prefab);
        this.node.addChild(item);
        item.setPosition(pos)
        return item;
    },
    drawMapBG: function (data) {
        let pos;

        if(!data||data.length === 0) return false;
        
        for(let i=0;i<data[0].length;i++){
            for(let j=0;j<data.length;j++){
                pos = cc.p(this.mapItemX*i,this.mapItemY*j);
                this.spawnNewItem(pos,this.groudPrefab);
            }
        }
    },

    drawMap: function (data) {
        let pos,axisObj;
        console.log(data);
        if(!data||data.length === 0) return false;

        for(let i=0;i<data.length;i++){
            for(let j=0;j<data[0].length;j++){
                axisObj = this.transAxis(data.length,i,j);
                pos = cc.p(this.mapItemX*axisObj.x,this.mapItemY*axisObj.y);
                
                switch (data[i][j]) {
                    case S_W_1:
                        this.spawnNewItem(pos,this.blockPrefab);
                        break;
                    case NG_W_1:
                        this.spawnNewItem(pos,this.barrierPrefab);
                        break;
                    default:
                        break;
                }
            }
        }
    },
    // 后台二维数组索引 转为 世界坐标系
    transAxis: function (len,x,y) {
        let axisObj ={};
        axisObj.x = y;
        axisObj.y = len-x-1;
        return axisObj;
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
            case cc.KEY.j:
                console.log('Press j key');
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
