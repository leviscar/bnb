cc.Class({
    extends: cc.Component,

    properties: {
        bombAddLabel: cc.Label,
        speedLabel: cc.Label,
        strengthLabel: cc.Label,
        scoreLabel: cc.Label,
        scorePanel: cc.Node
    },

    init: function (pos){
        this.bombAddNum = 0;
        this.speedNum = 0;
        this.strengthNum = 0;
        this.scoreNum = 0;
        this.scorePanel.position = pos;
        this.setNum(this.bombAddNum,this.speedNum,this.strengthNum,this.scoreNum);
    },

    updateNum: function (bombAdd,speed,strength,score){
        this.bombAddNum += bombAdd;
        this.speedNum += speed;
        this.strengthNum += strength;
        this.scoreNum += score;
        this.setNum(this.bombAddNum,this.speedNum,this.strengthNum,this.scoreNum);
    },

    setNum: function (bombAddNum,speedNum,strengthNum,scoreNum){
        this.bombAddLabel.string = "X" + bombAddNum;
        this.speedLabel.string = "X" + speedNum;
        this.strengthLabel.string = "X" + strengthNum;
        this.scoreLabel.string = scoreNum;
    }
});
