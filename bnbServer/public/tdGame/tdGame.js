var TDMap = require('./tdMap')
var Role = require('./tdRole')
var TDPaoPao = require('./tdPaopao')

//主游戏入口
var TDGame = function (serverIO, roomName) {
    this.io = serverIO;
    this.roomName = roomName;
    this.tdMap = new TDMap.TDMap();
    this.roleArr = [];
    this.paopaoArr = [];
    this.masterRole = null;
    this.challengerRole = null;
    this.winner=null;

    this.gameInfoInterval = null;

    this.createMasterRole = function(x,y){
        this.masterRole = new Role.Role('master',this);
        this.masterRole.setPosition(x,y);
        this.masterRole.setMap(this.tdMap);
        this.roleArr.push(this.masterRole);
    }

    this.createChallengerRole = function(x,y){
        this.challengerRole = new Role.Role('challenger',this);
        this.challengerRole.setPosition(x,y);
        this.challengerRole.setMap(this.tdMap);
        this.roleArr.push(this.challengerRole);
        this.challengerRole.createPaopao();
    }

    this.startGame = function(){
        this.io.to(this.roomName).emit('start',{});
    }

    this.stopGame = function(data){
        console.log('end');
        console.log(data);
        this.io.to(this.roomName).emit('end',{data:data});
    }

    return this;


    
}




module.exports = {
    TDGame:TDGame,

}
