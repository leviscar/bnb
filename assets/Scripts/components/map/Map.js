const com = require("../../Common");

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
// let basicMap = [
//     [ 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11 ],
//     [ 11, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0, 0, 11 ],
//     [ 11, 0, 0, 3, 0, 3, 0, 3, 0, 3, 11, 0, 11 ],
//     [ 11, 0, 11, 3, 0, 3, 0, 3, 0, 3, 0, 0, 11 ],
//     [ 11, 0, 0, 3, 0, 3, 0, 3, 0, 3, 11, 0, 11 ],
//     [ 11, 0, 0, 3, 0, 3, 0, 3, 0, 3, 0, 0, 11 ],
//     [ 11, 0, 3, 3, 0, 3, 0, 3, 11, 3, 11, 0, 11 ],
//     [ 11, 0, 3, 3, 0, 3, 0, 3, 11, 3, 0, 0, 11 ],
//     [ 11, 0, 0, 3, 0, 3, 0, 3, 11, 3, 11, 0, 11 ],
//     [ 11, 0, 0, 3, 0, 3, 0, 3, 11, 3, 0, 0, 11 ],
//     [ 11, 0, 0, 3, 0, 3, 0, 3, 11, 3, 0, 0, 11 ],
//     [ 11, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 11 ],
//     [ 11, 0, 11, 3, 11, 3, 11, 3, 11, 3, 11, 0, 11 ],
//     [ 11, 0, 3, 3, 0, 0, 0, 0, 0, 3, 0, 0, 11 ],
//     [ 11, 0, 11, 3, 11, 3, 11, 3, 11, 3, 11, 0, 11 ],
//     [ 11, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 11 ],
//     [ 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11 ] ];

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
        //角色被炸效果
        roleBoomPrefab: cc.Prefab,
        
        // 结束页面
        endPage: cc.Node,

        player:  cc.Node,
        // 放置炸弹按钮
        bombBtn: cc.Button,

        timerDisplay:cc.Label,
        masterScoreDisplay: cc.Label,
        challengerScoreDisplay:cc.Label,

        mapItemX: 0,
        mapItemY: 0,
        mapDataLen: 0,

        gameTime: 0,
        masterScore: 0,
        challengerScore: 0,
        

    },
    
    onLoad: function(){
        let self = this;
        let socket = com.socket;
        let roleObj = {};
        let masterRole,challengerRole,masterPos,challengerPos;

        this.mapItemX = 32;
        this.mapItemY = 32;

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

            // 角色爆炸
            998: self.roleBoomPrefab,

            // 爆炸道具
            999: self.explodePrefab
        };

        console.log("game start");

        // console.log(com.map.basicMap);
        // this.drawMapBG.call(this);
        this.drawMapBG = this.drawMapBG.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.spawnNewItem = this.spawnNewItem.bind(this);
        this.dropItem = this.dropItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.addBoom = this.addBoom.bind(this);
        this.socketHandle = this.socketHandle.bind(this);

        

        // console.log("屏幕："+com.windowSize.width/2+":"+com.windowSize.height*24/25);
        // this.timePanel.setPosition(cc.p(0,0));
        // this.timerDisplay.position = cc.p(com.windowSize.width/2,com.windowSize.height*24/25);
        // this.challengerScoreDisplay.position = cc.p(com.windowSize.width*5/6,com.windowSize.height*24/25);
        // this.masterScoreDisplay.position = cc.p(com.windowSize.width*7/6,com.windowSize.height*24/25);

        console.log(com.map.basicMap);

        this.socketHandle(roleObj,socket,self);

        try {
            this.drawMapBG(com.map.basicMap);
            this.drawMap(com.map.basicMap);
        } catch (error) {
            console.error(error)
        }

 
        // try {
        //     this.drawMapBG(basicMap);
        //     this.drawMap(basicMap);
        // } catch (error) {
        //     console.error(error)
        // }
        
    
        // this.dropItem(arr);
        masterPos = cc.p(32*11,32*9);
        challengerPos = cc.p(32,32);
        masterRole = this.spawnNewItem(masterPos,this.masterPrefab);
        challengerRole = this.spawnNewItem(challengerPos,this.challengerPrefab);


        roleObj['master'] = masterRole;
        roleObj['challenger'] = challengerRole;

        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // this.drawMap.call(this);
        
        this.node.setPosition(cc.p(0,0));

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

    addRoleBoom: function (obj) {
        let pos,axisObj;
        if(!obj) return false;
 
        axisObj = this.transAxis(this.mapDataLen,obj.x,obj.y);
        pos = cc.p(this.mapItemX*axisObj.x,this.mapItemY*axisObj.y);
        this.spawnNewItem(pos,prefabList[998]);

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

    socketHandle: function (roleObj,socket,self) {

        try {
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
                    }else if(val.name === 'challenger'){
                        self.challengerScore = val.score;
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
    
            socket.on("roleBoom",function(data){
                self.addRoleBoom(data);
            });
        } catch (error) {
            console.error(error)
        }
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

    update (dt) {
        this.timerDisplay.string = parseInt(this.gameTime/60)+":"+(this.gameTime%60);
        this.masterScoreDisplay.string = this.masterScore.toString();
        this.challengerScoreDisplay.string = this.challengerScore.toString();
    },
});
