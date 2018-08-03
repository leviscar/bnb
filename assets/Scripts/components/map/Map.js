const com = require("../../Common");

const GROUND       = 0;

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
let roleObj = {};
let roleInfos = [];
//道具计数
let bombAddScoreMaster,bombAddScoreChallenger,speedScoreMaster,speedScoreChallenger,strengthScoreMaster,strengthScoreChallenger;
//背景音乐
var bgmMusic;

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
        //小怪物
        monsterPrefab: cc.Prefab,
        monsterGrayPrefab: cc.Prefab,
        
        // map背景
        mapBG: cc.Node,
        
        // 结束页面
        endPage: cc.Node,

        player:  cc.Node,

        cameraContatiner: cc.Node,
        background: cc.Node,
        // 放置炸弹按钮
        bombBtn: cc.Button,

        timerDisplay:cc.Label,
        masterScoreDisplay: cc.Label,
        challengerScoreDisplay:cc.Label,

        bombAddScoreMasterDisplay: cc.Label,
        bombAddScoreChallengerDisplay: cc.Label,
        speedScoreMasterDisplay: cc.Label,
        speedScoreChallengerDisplay: cc.Label,
        strengthScoreMasterDisplay: cc.Label,
        strengthScoreChallengerDisplay: cc.Label,


        mapItemX: 0,
        mapItemY: 0,
        mapDataLen: 0,

        gameTime: 0,
        masterScore: 0,
        challengerScore: 0,

        //背景音乐
        bgmAudio:{
            default: null,
            url: cc.AudioClip
        },

        //吃礼物音乐
        giftAudio:{
            default: null,
            url: cc.AudioClip
        },

        //怪物被炸音乐
        monsterBoomAudio:{
            default: null,
            url: cc.AudioClip
        },

        //人物被炸音乐
        roleBoomAudio:{
            default: null,
            url: cc.AudioClip
        },
        
        //泡泡爆炸音乐
        paopaoBoomAudio:{
            default: null,
            url: cc.AudioClip
        },

    },
    
    onLoad: function(){
        let self = this;
        let socket = com.socket;

        this.mapItemX = 32;
        this.mapItemY = 32;

        roleInfos = [];
        this.firstData = {"master":true,"challenger":false};
        this.masterPos = 0;
        this.challengerPos = 0;

        //道具计数
        bombAddScoreMaster = 0;
        bombAddScoreChallenger = 0;
        speedScoreMaster = 0;
        speedScoreChallenger = 0;
        strengthScoreMaster = 0;
        strengthScoreChallenger = 0;

        prefabList = {
            // 地面预制资源 GROUND : 10
            // 0: self.groudPrefab,

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

            //小怪物
            997:self.monsterPrefab,

            // 角色爆炸
            998: self.roleBoomPrefab,

            // 爆炸道具
            999: self.explodePrefab
        };

        this.roleInit = this.roleInit.bind(this);
        this.keyInit = this.keyInit.bind(this);
        this.mapInit = this.mapInit.bind(this);
        this.drawMapBG = this.drawMapBG.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.spawnNewItem = this.spawnNewItem.bind(this);
        this.dropItem = this.dropItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.addBoom = this.addBoom.bind(this);
        this.socketHandle = this.socketHandle.bind(this);

        this.background.setScale(com.windowSize.width/960,com.windowSize.height/640);
        try {
            this.socketHandle(roleObj,socket,self);
            this.drawMapBG(com.map.basicMap);
            this.drawMap(com.map.basicMap);
            this.roleInit();
            this.keyInit();
            this.mapBG.width = com.map.basicMap[0].length*this.mapItemX;
            this.mapBG.height = com.map.basicMap.length*this.mapItemY;
            if(wx){
                // 头像显示有bug，调用两次函数可以解决这个bug
                // 治标不治本，再研究
                this.loadAvatar(com.userInfos);
                this.loadAvatar(com.userInfos);
            }
            
        } catch (error) {
            console.error(error)
        }
        
       

    },

    start: function () {
        let self = this;
        //播放背景音乐
        bgmMusic = cc.audioEngine.play(self.bgmAudio,true,1);
        
        this.mapInit();  
        

        // 按照帧率移动
        this.roleMoveInterval = setInterval(function(){
            let data = roleInfos;
            if(data == null || data.length ==0){
                clearInterval(self.roleMoveInterval);
            }
            data.forEach(function(val){
                let position = cc.p(val.position.x,val.position.y);

                // roleObj[val.name].setPosition(position);
                roleObj[val.name].stopAllActions();
                roleObj[val.name].runAction(cc.moveTo((1/com.FPS),position));

                if(val.gameTime>=0){
                    self.gameTime = val.gameTime;
                }
                
                if(val.name === 'master'){
                    self.masterScore = val.score;
                    if(self.firstData.master === true)  {
                        self.masterPos = position;
                        self.firstData.master = false;
                    }
                }else if(val.name === 'challenger'){
                    self.challengerScore = val.score;
                    if(self.firstData.challenger === true) {
                        self.challengerPos = position;
                        self.firstData.challenger = false;
                    } 
                }

                let monsterInfos = com.monsterInfos;
                monsterInfos.forEach(function(val){
                    let position = cc.p(val.position.x,val.position.y);
                    roleObj[val.name].stopAllActions();
                    roleObj[val.name].runAction(cc.moveTo((1/com.FPS),position));
                })
            })
        },1000/com.FPS);
        

    },

    // 加载头像
    loadAvatar: function (userInfos) {
        for (let index in userInfos) {
            let tag = "score"+(parseInt(index)+1)+"/avatar";
            cc.loader.load(userInfos[index].avatarUrl + "?aaa=aa.png", function (err, tex) {
            //   cc.log('Result should be a texture: ' + (tex instanceof cc.Texture2D));
            //   let spriteFrame = cc.find(tag).getComponent(cc.Sprite).spriteFrame;
              cc.find(tag).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
              cc.find(tag).getComponent(cc.Sprite).spriteFrame.getTexture().width = 59;
              cc.find(tag).getComponent(cc.Sprite).spriteFrame.getTexture().height = 59;
            });
        }
        
    },

    // 开始场景
    mapInit: function () {
        let cameraAction,duration = 5 ,delayTime = 3;
        this.node.setScale(cc.v2(0.7,0.7));
        this.cameraContatiner.setPosition(cc.p(360,280));
        let mapAction = cc.sequence(
            // cc.scaleTo(2,0.7,0.7),
            cc.delayTime(3),
            cc.scaleTo(duration,1.68,1.68)
        );

        if(com.isMaster){
            cameraAction = cc.sequence(
                // cc.moveTo(2,cc.p(32,32)),
                cc.delayTime(delayTime),
                // cc.moveTo(2,cc.p(32*22,32*18))
                cc.moveTo(duration,cc.p(32,32))
            );
        }else{
            cameraAction = cc.sequence(
                cc.delayTime(delayTime),
                // cc.moveTo(2,cc.p(32,32)),
                // cc.delayTime(1),
                cc.moveTo(duration,cc.p(32*22,32*18))
            );
        }

        // console.log(cameraAction);
        com.moveMap = true;
        
        this.node.runAction(mapAction);
        this.cameraContatiner.runAction(cameraAction);

        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            com.moveMap = false;
            // this.node.setScale(cc.v2(1.68,1.68));
            
        }, (delayTime+duration+1));
    },

    // 角色位置初始化
    roleInit: function () {
        let masterRole,challengerRole,masterPos,challengerPos;

        //小怪物从0开始命名
        let monster0,monsterPos0,monster1,monsterPos1;

        masterPos = cc.p(32*22,32*18);
        challengerPos = cc.p(32,32);
        monsterPos0 = cc.p(32*22,32);
        monsterPos1 = cc.p(32,32*18);

        masterRole = this.spawnNewItem(masterPos,this.masterPrefab);
        monster0 = this.spawnNewItem(monsterPos0,this.monsterPrefab);
        monster1 = this.spawnNewItem(monsterPos1,this.monsterGrayPrefab);

        roleObj['master'] = masterRole;
        roleObj['monster0'] = monster0;
        roleObj['monster1'] = monster1;

        if(com.userInfos.length>1){
            challengerRole = this.spawnNewItem(challengerPos,this.challengerPrefab);
            roleObj['challenger'] = challengerRole;
        }
    },

    // 键盘监听事件初始化
    keyInit: function () {
        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
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
                // this.spawnNewItem(pos,this.groudPrefab);
                
                if(data[i][j] === S_W_1)  this.spawnNewItem(pos,this.blockPrefab);
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

    // 添加炸弹
    addBoom: function (obj) {
        let pos,axisObj;
        if(!obj) return false;
 
        axisObj = this.transAxis(this.mapDataLen,obj.position.x,obj.position.y);
        pos = cc.p(this.mapItemX*axisObj.x,this.mapItemY*axisObj.y);
        itemList[obj.position.x][obj.position.y] = this.spawnNewItem(pos,prefabList[100]);

    },

    // 增加角色爆炸效果
    addRoleBoom: function (obj) {
        if(!obj) return false;
        let pos = cc.p(obj.x,obj.y);
        this.spawnNewItem(pos,prefabList[998]);
    },

    // 爆炸动作
    boomAction: function (arr) {
        let pos,axisObj;
        if(!arr||arr.length===0) return false;
        for(let i=0;i<arr.length;i++){
            axisObj = this.transAxis(this.mapDataLen,arr[i].x,arr[i].y);
            pos = cc.p(this.mapItemX*axisObj.x,this.mapItemY*axisObj.y);
            itemList[arr[i].x][arr[i].y] = this.spawnNewItem(pos,prefabList[999]);
        }
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            this.dropItem(arr);
        }, 0.2);
        
    },

    // 后台二维数组索引 转为 世界坐标系
    transAxis: function (len,x,y) {
        let axisObj ={};
        axisObj.x = y;
        axisObj.y = len-x-1;
        return axisObj;
    },

    // socket事件
    socketHandle: function (roleObj,socket,self) {
        let moveAction ={};
        try {
            socket.on("roleInfo",function(data){
                roleInfos = data;
            });

            socket.on("monsterInfo",function(data){
                com.monsterInfos = data;
            });
    
            socket.on("itemEaten",function(data){
                console.log("item eaten"+ data);
                if(data.role === 'master'||data.role === 'challenger'){
                    cc.audioEngine.playEffect(self.giftAudio,false);
                }
                self.node.removeChild(itemList[data.x][data.y]);
                itemList[data.x][data.y] = null;
                if(data.itemCode == I_PAOPAO){
                    if(data.role === 'master'){
                        bombAddScoreMaster += 1;
                    }else if(data.role === 'challenger'){
                        bombAddScoreChallenger += 1;
                        // console.log("item challenger"+ this. bombAddScoreChallenger);
                    }
                }else if(data.itemCode == I_SPEED){
                    if(data.role === 'master'){
                        speedScoreMaster += 1;
                    }else if(data.role === 'challenger'){
                        speedScoreChallenger += 1;
                        // console.log("item challenger"+  this.speedScoreChallenger+"");
                    }
                }else if(data.itemCode == I_POWER){
                    if(data.role === 'master'){
                        strengthScoreMaster += 1;
                    }else if(data.role === 'challenger'){
                        strengthScoreChallenger += 1;
                        // console.log("item challenger"+  this.strengthScoreChallenger)+"";
                    }
                }
            });
    
    
            socket.on("boomInfo",function (data) {
                // console.log(data);
                cc.audioEngine.playEffect(self.paopaoBoomAudio,false);
                self.dropItem(data.boomPaopaoArr);
                self.dropItem(data.boomBoxArr);
                self.addItem(data.itemArr);
                self.boomAction(data.boomXYArr);
            });
    
            socket.on("paopaoCreated",function (data) {
                self.addBoom(data);
            });
    
            socket.on("roleBoom",function(data){
                cc.audioEngine.playEffect(self.roleBoomAudio,false);
                self.addRoleBoom(data);
            });

            socket.on("monsterBoom",function(data){
                console.log(data.name+"Boom") 
                cc.audioEngine.playEffect(self.monsterBoomAudio,false);
                self.node.removeChild(roleObj[data.name])
            });

        } catch (error) {
            console.error(error)
        }
    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.audioEngine.stop(bgmMusic);
        roleInfos = [];
        console.log("map destroyed!!!!!!!!!!!!!!!!!1");
    },

    onKeyDown: function (event) {
        let socket = com.socket;
        switch(event.keyCode) {
            case cc.KEY.a:
                socket.emit("KeyDown",event.keyCode);
                break;
            case cc.KEY.s:
                socket.emit("KeyDown",event.keyCode);
                break;
            case cc.KEY.w:
                socket.emit("KeyDown",event.keyCode);
                break;
            case cc.KEY.d:
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
                socket.emit("KeyUp",event.keyCode);
                break;
            case cc.KEY.s:
                socket.emit("KeyUp",event.keyCode);
                break;
            case cc.KEY.w:
                socket.emit("KeyUp",event.keyCode);
                break;
            case cc.KEY.d:
                socket.emit("KeyUp",event.keyCode);
                break;
        }
    },

    transTime: function (data) {
        if(data<0) return false;
        return data<10?"0"+data:data;  
    },

    update (dt) {
        this.timerDisplay.string = this.transTime(parseInt(this.gameTime/60))+":"+this.transTime(this.gameTime%60);
        this.masterScoreDisplay.string = this.masterScore.toString();
        this.challengerScoreDisplay.string = this.challengerScore.toString();
        this.bombAddScoreMasterDisplay.string = bombAddScoreMaster+"";
        this.bombAddScoreChallengerDisplay.string = bombAddScoreChallenger+"";
        this.speedScoreMasterDisplay.string = speedScoreMaster+"";
        this.speedScoreChallengerDisplay.string = speedScoreChallenger+"";
        this.strengthScoreMasterDisplay.string = strengthScoreMaster+"";
        this.strengthScoreChallengerDisplay.string =strengthScoreChallenger+"";
    }

});
