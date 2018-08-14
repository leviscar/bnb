const com = require("../../Common");

const GROUND = 0;
const NG_W_1  = 1;
const NG_W_2  = 2;
const G_W  = 3;
const S_W_1 = 11;
const S_W_2 = 12;
const S_W_3 = 13;
const PAOPAO = 100;
const I_PAOPAO = 101;
const I_SPEED  = 102;
const I_POWER  = 103;
const I_SCORE  = 104;

const itemList = [];
const roleObj = {};
const monsterObj = {};
const scoreObj = {};
let rolePrefabArr = [];
let bombPrefabArr = [];
let monsterPrefabArr = [];
let score = [0,0,0,0,0,0,0,0];
let prefabList  = {};
let roleInfos = [];
let bgmMusic = null;

cc.Class({
    extends: cc.Component,

    editor: {
        requireComponent: cc.TiledMap
    },

    properties: {
        // 角色
        player1Prefab: cc.Prefab,
        player2Prefab: cc.Prefab,
        player3Prefab: cc.Prefab,
        player4Prefab: cc.Prefab,
        // 炸弹预制资源
        bomb1Prefab: cc.Prefab,
        bomb2Prefab: cc.Prefab,
        bomb3Prefab: cc.Prefab,
        bomb4Prefab: cc.Prefab,
        // 小怪物
        monster1Prefab: cc.Prefab,
        monster2Prefab: cc.Prefab,
        // 得分面板
        scorePrefab: cc.Prefab,
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
        // 角色被炸效果
        roleBoomPrefab: cc.Prefab,
        // Node
        mapBG: cc.Node,
        endPage: cc.Node,
        cameraContatiner: cc.Node,
        background: cc.Node,
        // 放置炸弹按钮
        bombBtn: cc.Button,
        backBtn: cc.Button,
        // Labels
        timerDisplay:cc.Label,
        // 背景音乐
        bgmAudio:cc.AudioClip,
        giftAudio:cc.AudioClip,
        monsterBoomAudio:cc.AudioClip,
        roleBoomAudio:cc.AudioClip,
        paopaoBoomAudio:cc.AudioClip
    },
    
    onLoad: function (){
        const self = this;
        const socket = com.socket;

        this.mapItemX = 32;
        this.mapItemY = 32;
        this.gameTime = 0;

        roleInfos = [];
        score = [0,0,0,0,0,0,0,0];
        prefabList = {
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

            // 小怪物
            997:self.monsterPrefab,

            // 角色爆炸
            998: self.roleBoomPrefab,

            // 爆炸道具
            999: self.explodePrefab
        };
        rolePrefabArr = [this.player1Prefab,this.player2Prefab,this.player3Prefab,this.player4Prefab];
        bombPrefabArr = [this.bomb1Prefab,this.bomb2Prefab,this.bomb3Prefab,this.bomb4Prefab];
        monsterPrefabArr = [this.monster1Prefab,this.monster2Prefab];

        this.roleInit = this.roleInit.bind(this);
        this.roleMove = this.roleMove.bind(this);
        this.keyInit = this.keyInit.bind(this);
        this.mapInit = this.mapInit.bind(this);
        this.drawMap = this.drawMap.bind(this);
        this.spawnNewItem = this.spawnNewItem.bind(this);
        this.dropItem = this.dropItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.addBoom = this.addBoom.bind(this);
        this.socketHandle = this.socketHandle.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.initScorePanel = this.initScorePanel.bind(this);
        this.backBtn.node.on("click",this.backStart,this);
        this.background.setScale(com.windowSize.width / 960,com.windowSize.height / 640);
        this.mapBG.width = com.mapInfo.arr[0].length * this.mapItemX;
        this.mapBG.height = com.mapInfo.arr.length * this.mapItemY;

        this.socketHandle(roleObj,socket,self);
        this.drawMap(com.mapInfo.arr);
        this.roleInit(self);
        this.initScorePanel(self);
        try {
            if(wx){
                this.loadAvatar(com.userInfos);
            }
        } catch (error){
            console.error(error);
        }
    },

    start: function (){
        const self = this;

        // 播放背景音乐
        bgmMusic = cc.audioEngine.play(self.bgmAudio,true,1);
        
        this.mapInit();
        this.keyInit();
        this.roleMove(self);  
    },

    /** 
     * 加载头像
    */
    loadAvatar: function (userInfos){
        for (const index in userInfos){
            const tag = "score" + (parseInt(index) + 1) + "/avatar";

            cc.loader.load(userInfos[index].avatarUrl + "?aaa=aa.png", function (err, tex){
                cc.find(tag).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
            });
        }
        
    },

    /** 
     * 开始场景
    */
    mapInit: function (){
        const duration = 5;
        const delayTime = 3;
        const setScale = 1.68;
        const originScale = cc.v2(0.7,0.7);
        const originPos = cc.p(360,280);
        let cameraAction;
        const mapAction = cc.sequence(
            cc.delayTime(3),
            cc.scaleTo(duration,setScale,setScale)
        );

        this.node.setScale(originScale);
        this.cameraContatiner.setPosition(originPos);
        
        com.userInfos.forEach(function (item){
            if(item.guid === com.userInfo.guid){
                com.roleIndex = item.roleIndex;
                cameraAction = cc.sequence(
                    cc.delayTime(delayTime),
                    cc.moveTo(duration,cc.p(com.mapInfo.roleStartPointArr[item.roleIndex].x,com.mapInfo.roleStartPointArr[item.roleIndex].y))
                );
            }
        });

        com.moveMap = true;
        
        this.node.runAction(mapAction);
        this.cameraContatiner.runAction(cameraAction);

        this.scheduleOnce(function (){
            com.moveMap = false;
        }, (delayTime + duration + 1));
    },

    /** 
     * 角色位置初始化
    */
    roleInit: function (self){
        com.userInfos.forEach(function (item){
            const pos = cc.p(com.mapInfo.roleStartPointArr[item.roleIndex].x,com.mapInfo.roleStartPointArr[item.roleIndex].y);
            
            roleObj[item.guid] = self.spawnNewRole(pos,rolePrefabArr[item.roleIndex],item.guid);
        });

        com.mapInfo.monsterStartPointArr.forEach(function (item,index){
            monsterObj[index] = self.spawnNewItem(cc.p(item.x,item.y),monsterPrefabArr[index]);
        });
    },

    /** 
     * 角色移动
    */
    roleMove: function (self){
        this.roleMoveInterval = setInterval(function (){
            const roleData = roleInfos;
            const monsterInfos = com.monsterInfos;

            if(roleData == null || roleData.length == 0){
                clearInterval(self.roleMoveInterval);
            }

            roleData.forEach(function (val){
                const position = cc.p(val.position.x,val.position.y);
                
                roleObj[val.roleGuid].stopAllActions();
                roleObj[val.roleGuid].runAction(cc.moveTo((1 / com.FPS),position));

                // TODO
                // val.name === "master" ? score[0] = val.score : score[1] = val.score;
                scoreObj[val.roleGuid].getComponent("Score").updateScore(val.score);

                self.updateTime(val.gameTime >= 0 ? val.gameTime : 0);
            });

            monsterInfos.forEach(function (val){
                const position = cc.p(val.position.x,val.position.y);

                monsterObj[val.monsterIndex].stopAllActions();
                monsterObj[val.monsterIndex].runAction(cc.moveTo((1 / com.FPS),position));
            });
        },1000 / com.FPS);  
    },

    /**
     * 键盘监听事件初始化
     */
    keyInit: function (){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    /**
     * 在地图上生成新item
     */
    spawnNewItem: function (pos,prefab){
        const item = cc.instantiate(prefab);

        this.node.addChild(item);
        item.setPosition(pos);

        return item;
    },

    /**
     * 在地图上生成新Role
     */
    spawnNewRole: function (pos,prefab,name){
        const item = cc.instantiate(prefab);
        
        item.name = name;
        this.node.addChild(item);
        item.setPosition(pos);
        
        return item;
    },

    /**
     * 在地图上生成新得分面板
     */
    spawnNewScore: function (pos,prefab,name){
        const item = cc.instantiate(prefab);
        
        item.name = name;
        cc.find("scorePanel").addChild(item);
        // item.setPosition(pos);
        item.getComponent("Score").init(pos);

        return item;
    },

    /**
     * 绘制地图上的物体
     */
    drawMap: function (data){
        let pos,axisObj;

        if(!data || data.length === 0) return false;
        this.mapDataLen = data.length;
        for(let i = 0;i < data.length;i++){
            itemList[i] = [];
            for(let j = 0;j < data[0].length;j++){
                axisObj = this.transAxis(data.length,i,j);
                pos = cc.p(this.mapItemX * axisObj.x,this.mapItemY * axisObj.y);
                if(data[i][j] !== GROUND && data[i][j] != S_W_1){
                    itemList[i][j] = this.spawnNewItem(pos,prefabList[data[i][j]]);
                }else if(data[i][j] === S_W_1){
                    this.spawnNewItem(pos,this.blockPrefab);
                }                
            }
        }
    },

    /**
     * 移除一组物体
     */
    dropItem: function (arr){
        if(!arr || arr.length === 0) return false;
        for(let i = 0;i < arr.length;i++){
            this.node.removeChild(itemList[arr[i].x][arr[i].y]);
            itemList[arr[i].x][arr[i].y] = null;
        }
    } ,

    /**
     * 增加一组物体
     */
    addItem: function (arr){
        let pos,axisObj;

        if(!arr || arr.length === 0) return false;
        for(let i = 0;i < arr.length;i++){
            axisObj = this.transAxis(this.mapDataLen,arr[i].x,arr[i].y);
            pos = cc.p(this.mapItemX * axisObj.x,this.mapItemY * axisObj.y);
            itemList[arr[i].x][arr[i].y] = this.spawnNewItem(pos,prefabList[arr[i].itemCode]);
        }
    },

    /**
     * 添加炸弹
     */
    addBoom: function (obj){
        let boomPrefab = null;

        if(!obj) return false;
        com.userInfos.forEach(function (item,index){
            if(item.guid === obj.roleGuid){
                boomPrefab = bombPrefabArr[index];
            }
        });
        
        const axisObj = this.transAxis(this.mapDataLen,obj.position.x,obj.position.y);
        const pos = cc.p(this.mapItemX * axisObj.x,this.mapItemY * axisObj.y);

        itemList[obj.position.x][obj.position.y] = this.spawnNewItem(pos,boomPrefab);
        
    },

    /**
     * 增加角色爆炸效果
     */
    addRoleBoom: function (obj){
        const delay = 3;

        if(!obj) return false;
        const pos = cc.p(obj.x,obj.y);

        const roleBoom = this.spawnNewItem(pos,prefabList[998]);

        this.scheduleOnce(function (){
            this.node.removeChild(roleBoom);
        }, delay);
        
    },

    /**
     * 爆炸动作
     */
    boomAction: function (arr){
        let pos,axisObj;

        if(!arr || arr.length === 0) return false;
        for(let i = 0;i < arr.length;i++){
            axisObj = this.transAxis(this.mapDataLen,arr[i].x,arr[i].y);
            pos = cc.p(this.mapItemX * axisObj.x,this.mapItemY * axisObj.y);
            itemList[arr[i].x][arr[i].y] = this.spawnNewItem(pos,prefabList[999]);
        }
        this.scheduleOnce(function (){
            this.dropItem(arr);
        }, 0.2);
        
    },

    /**
     * 后台二维数组索引 转为 世界坐标系
     */
    transAxis: function (len,x,y){
        const axisObj = {};

        axisObj.x = y;
        axisObj.y = len - x - 1;

        return axisObj;
    },

    transTime: function (data){
        if(data < 0) return false;

        return data < 10 ? "0" + data : data;  
    },

    /**
     * socket事件
     */
    socketHandle: function (roleObj,socket,self){
        const moveAction = {};

        try {
            socket.on("roleInfo",function (data){
                roleInfos = data;
            });

            socket.on("monsterInfo",function (data){
                com.monsterInfos = data;
            });
    
            socket.on("itemEaten",function (data){
                if(!data) return false;
                if(data.roleGuid !== null){
                    cc.audioEngine.playEffect(self.giftAudio,false);
                }
                self.node.removeChild(itemList[data.x][data.y]);
                itemList[data.x][data.y] = null;
                scoreObj[data.roleGuid].getComponent("Score").updateItemNum(data);
            });
    
            socket.on("boomInfo",function (data){
                cc.audioEngine.playEffect(self.paopaoBoomAudio,false);
                self.dropItem(data.boomPaopaoArr);
                self.dropItem(data.boomBoxArr);
                self.addItem(data.itemArr);
                self.boomAction(data.boomXYArr);
            });
    
            socket.on("paopaoCreated",function (data){
                self.addBoom(data);
            });
    
            socket.on("roleBoom",function (data){
                cc.audioEngine.playEffect(self.roleBoomAudio,false);
                self.addRoleBoom(data);
                self.node.removeChild(roleObj[data.roleGuid]);
                scoreObj[data.roleGuid].getComponent("Score").setImageGray();
            });

            socket.on("monsterBoom",function (data){
                cc.audioEngine.playEffect(self.monsterBoomAudio,false);
                self.node.removeChild(monsterObj[data.monsterIndex]);
            });

        } catch (error){
            console.error(error);
        }
    },

    onKeyDown: function (event){
        const socket = com.socket;

        switch(event.keyCode){
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
            console.log("Press j key");
            socket.emit("KeyDown",event.keyCode);
            break;
        }
    },

    onKeyUp: function (event){
        const socket = com.socket;

        switch(event.keyCode){
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

    /** 
     * 更新时间
    */
    updateTime: function (gameTime){
        this.timerDisplay.string = this.transTime(parseInt(gameTime / 60)) + ":" + this.transTime(gameTime % 60);
    },

    /**
     * 返回大厅
     */
    backStart: function (){
        cc.director.loadScene("start");
    },

    /**
     * 生成得分面板
     */
    initScorePanel: function (self){
        const posArr =  [cc.p(80,560),cc.p(930,560),cc.p(80,480),cc.p(930,480)];

        com.userInfos.forEach(function (item){
            scoreObj[item.guid] = self.spawnNewScore(posArr[item.roleIndex],self.scorePrefab,item.guid + "score");
            scoreObj[item.guid].getComponent("Score").updateAvatar(item.avatarUrl);
            scoreObj[item.guid].getComponent("Score").initRoleAvatar(rolePrefabArr[item.roleIndex]);
        });

    },

    onDestroy: function (){
        roleInfos = [];
        com.monsterInfos = [];
        cc.audioEngine.stop(bgmMusic);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
});
