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


let itemList = [];
let prefabList  = {};

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
        // 爆炸资源
        explodePrefab: cc.Prefab,
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
        
        // 结束页面
        endPage: cc.Node,

        player:  cc.Node,
        // 放置炸弹按钮
        bombBtn: cc.Button,
        mapItemX: 0,
        mapItemY: 0,
        mapDataLen: 0,

        gameTime: 0,
        masterScore: 0,
        challengerScore: 0,
        timerDisplay: {
            default: null,
            type: cc.Label
        },
        masterScoreDisplay:{
            default: null,
            type: cc.Label
        },
        challengerScoreDisplay:{
            default: null,
            type: cc.Label
        }

    },
    
    onLoad: function(){
        let self = this;
        let socket = com.socket;
        let masterPos = cc.p(32*11,32*9);
        let challengerPos = cc.p(32,32);
        let masterRole,challengerRole;
        // let socket = window.io("http://localhost:4000");
        // this._player = this.node.getChildByName("player");
        console.log("game start");
        
        let roleObj = {}
        let bombList = [];

        // com.windowSize = cc.view.getVisibleSize();
        // console.log(com.windowSize);

        prefabList = {
            // 地面预制资源 GROUND : 10
            0: self.groudPrefab,

            100: self.bombPrefab,

            // 墙预制资源 S_W_1
            11:  self.blockPrefab,

            // 障碍物预制资源 NG_W_1 1
            1: self.barrierPrefab,

            // G_W 3
            3: self.barrierPrefab,

            // 加速道具预制资源 I_SPEED
            102: self.speedPrefab,

            // 增加炸弹道具 I_PAOPAO
            101: self.addBombPrefab,

            // 增加威力预制道具 I_POWER
            103: self.strengthPrefab,
            104: self.strengthPrefab,

            // 爆炸道具
            999: self.explodePrefab
        };

        // console.log(com.map.basicMap);
        // this.drawMapBG.call(this);
        this.drawMapBG = this.drawMapBG.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.spawnNewItem = this.spawnNewItem.bind(this);
        this.dropItem = this.dropItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.addBoom = this.addBoom.bind(this);

        this.mapItemX = 32;
        this.mapItemY = 32;

        // console.log("屏幕："+com.windowSize.width/2+":"+com.windowSize.height*24/25);
        // this.timePanel.setPosition(cc.p(0,0));
        // this.timerDisplay.position = cc.p(com.windowSize.width/2,com.windowSize.height*24/25);
        // this.challengerScoreDisplay.position = cc.p(com.windowSize.width*5/6,com.windowSize.height*24/25);
        // this.masterScoreDisplay.position = cc.p(com.windowSize.width*7/6,com.windowSize.height*24/25);

        console.log(com.map.basicMap);

        this.drawMapBG(com.map.basicMap);
        this.drawMap(com.map.basicMap);
        
        // this.dropItem(arr);

        masterRole= this.spawnNewRole(masterPos,this.masterPrefab);
        challengerRole = this.spawnNewRole(challengerPos,this.challengerPrefab);


        roleObj['master'] = masterRole;
        roleObj['challenger'] = challengerRole;

        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // this.drawMap.call(this);
        
        socket.on("roleInfo",function(data){
            // console.log(data[0].name+": "+data[0].position.x +","+data[0].position.y);

            data.forEach(function(val){
                let position = cc.p(val.position.x,val.position.y);
                roleObj[val.name].setPosition(position);
                if(val.gameTime>=0){
                    self.gameTime = val.gameTime;
                }
                
                if(val.name === 'master'){
                    self.masterScore = val.score;
                    // console.log('masterScore'+self.masterScore);
                }else if(val.name === 'challenger'){
                    self.challengerScore = val.score;
                    // console.log('challengerScore'+self.challengerScore);
                }
            })

        });

        socket.on("itemEaten",function(pos){
            console.log("item eaten"+ pos);
            self.node.removeChild(itemList[pos.x][pos.y]);
            itemList[pos.x][pos.y] = null;
        });


        socket.on("boomInfo",function (data) {
            // console.log(data);
            self.dropItem(data.boomPaopaoArr);
            self.dropItem(data.boomBoxArr);
            self.addItem(data.itemArr);
            self.boomAction(data.boomXYArr);
        });

        socket.on("paopaoCreated",function (data) {
            self.addBoom(data);
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

    // 绘制背景地图
    drawMapBG: function (data) {
        let pos,axisObj;

        if(!data||data.length === 0) return false;
        this.mapDataLen = data.length;

        for(let i=0;i<data.length;i++){
            for(let j=0;j<data[0].length;j++){
                // 初始化itemList
                itemList[j] = []; 
                axisObj = this.transAxis(data.length,i,j);
                pos = cc.p(this.mapItemX*axisObj.x,this.mapItemY*axisObj.y);
                this.spawnNewItem(pos,this.groudPrefab);
                
                if(data[i][j]===S_W_1)  this.spawnNewItem(pos,this.blockPrefab);
            }
        }
    },

    // 绘制地图上的物体
    drawMap: function (data) {
        let pos,axisObj;
        if(!data||data.length === 0) return false;

        for(let i=0;i<data.length;i++){
            for(let j=0;j<data[0].length;j++){
                axisObj = this.transAxis(data.length,i,j);
                pos = cc.p(this.mapItemX*axisObj.x,this.mapItemY*axisObj.y);
                if(data[i][j]!==GROUND&&data[i][j]!=S_W_1){
                    itemList[i][j]=this.spawnNewItem(pos,prefabList[data[i][j]]);
                }                
                
            }
        }
    },

    // 移除一组物体(道具或者是墙)
    dropItem: function (arr) {
        if(!arr||arr.length===0) return false;
        for(let i=0;i<arr.length;i++){
            this.node.removeChild(itemList[arr[i].x][arr[i].y]);
            itemList[arr[i].x][arr[i].y] = null;
        }
    } ,

    // 增加一组物体(道具或者是墙)
    addItem: function (arr) {
        let pos,axisObj;
        if(!arr||arr.length===0) return false;
        for(let i=0;i<arr.length;i++){
            axisObj = this.transAxis(this.mapDataLen,arr[i].x,arr[i].y);
            pos = cc.p(this.mapItemX*axisObj.x,this.mapItemY*axisObj.y);
            itemList[arr[i].x][arr[i].y] = this.spawnNewItem(pos,prefabList[arr[i].itemCode]);
        }
    },

    addBoom: function (obj) {
        let pos,axisObj;
        if(!obj) return false;
 
        axisObj = this.transAxis(this.mapDataLen,obj.position.x,obj.position.y);
        pos = cc.p(this.mapItemX*axisObj.x,this.mapItemY*axisObj.y);
        itemList[obj.position.x][obj.position.y] = this.spawnNewItem(pos,prefabList[100]);

    },

    boomAction: function (arr) {
        let pos,axisObj;
        if(!arr||arr.length===0) return false;
        for(let i=0;i<arr.length;i++){
            axisObj = this.transAxis(this.mapDataLen,arr[i].x,arr[i].y);
            pos = cc.p(this.mapItemX*(axisObj.x+0.5),this.mapItemY*(axisObj.y+0.5));
            itemList[arr[i].x][arr[i].y] = this.spawnNewItem(pos,prefabList[999]);
        }
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            this.dropItem(arr);
        }, 0.1);
        
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
                // console.log('Press a key');
                socket.emit("KeyDown",event.keyCode);
                break;
            case cc.KEY.s:
                // console.log('Press s key');
                socket.emit("KeyDown",event.keyCode);
                break;
            case cc.KEY.w:
                // console.log('Press w key');
                socket.emit("KeyDown",event.keyCode);
                break;
            case cc.KEY.d:
                // console.log('Press d key');
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
                // console.log('release a key');
                socket.emit("KeyUp",event.keyCode);
                break;
            case cc.KEY.s:
                // console.log('release s key');
                socket.emit("KeyUp",event.keyCode);
                break;
            case cc.KEY.w:
                // console.log('release w key');
                socket.emit("KeyUp",event.keyCode);
                break;
            case cc.KEY.d:
                // console.log('release d key');
                socket.emit("KeyUp",event.keyCode);
                break;
        }
    },
    // onLoad () {},

    start () {

    },

    update (dt) {
        this.timerDisplay.string = parseInt(this.gameTime/60)+":"+(this.gameTime%60);
        this.masterScoreDisplay.string = this.masterScore.toString();
        this.challengerScoreDisplay.string = this.challengerScore.toString();
    },
});
