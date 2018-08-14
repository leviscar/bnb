const I_PAOPAO = 101;
const I_SPEED  = 102;
const I_POWER  = 103;
const I_SCORE  = 104;

cc.Class({
    extends: cc.Component,

    properties: {
        bombAddLabel: cc.Label,
        speedLabel: cc.Label,
        strengthLabel: cc.Label,
        scoreLabel: cc.Label,
        scorePanel: cc.Node,
        avatar: cc.Sprite,
    },

    init: function (pos){
        this.bombAddNum = 0;
        this.speedNum = 0;
        this.strengthNum = 0;
        this.scoreNum = 0;
        this.scorePanel.position = pos;
        this.setNum(this.bombAddNum,this.speedNum,this.strengthNum,this.scoreNum);
    },
    
    initRoleAvatar: function (prefab){
        const item = cc.instantiate(prefab);
        const pos = cc.p(-70,10);
        
        this.node.addChild(item);
        item.setPosition(pos);
        this.roleAvatarItem = item;

        return item;
    },

    setImageGray: function (){
        this.roleAvatarItem.getComponent(cc.Sprite)._sgNode.setState(1);
        try {
            this.avatar.getComponent(cc.Sprite)._sgNode.setState(1);
        } catch (error){
            console.error(error);
        }
    },

    updateItemNum: function (data){
        switch (data.itemCode){
        case I_PAOPAO:
            this.bombAddNum += 1;
            break;
        case I_SPEED:
            this.speedNum += 1;
            break;
        case I_POWER:
            this.strengthNum += 1;
            break;
        default:
            break;
        }
        this.setNum(this.bombAddNum,this.speedNum,this.strengthNum);
    },
    
    setNum: function (bombAddNum,speedNum,strengthNum,scoreNum){
        this.bombAddLabel.string = "X " + bombAddNum;
        this.speedLabel.string = "X " + speedNum;
        this.strengthLabel.string = "X " + strengthNum;
    },

    updateScore: function (score){
        this.scoreLabel.string = score;
    },

    updateAvatar: function (url){
        const self = this;

        if(url){
            cc.loader.load(url + "?aaa=aa.png", function (err, tex){
                self.avatar.spriteFrame = new cc.SpriteFrame(tex);
            });
        }
    }
});
