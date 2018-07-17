var constants = require('./tdConst')

var GROUND = constants.GROUND;
var NG_W_1 = constants.NO_GIFT_WALL_1;
var NG_W_2 = constants.NO_GIFT_WALL_2;
var G_W = constants.GIFT_WALL;

var S_W_1 = constants.SOLID_WALL_1;
var S_W_2 = constants.SOLID_WALL_2;
var S_W_3 = constants.SOLID_WALL_3;

var PAOPAO = constants.PAOPAO;

var I_PAOPAO = constants.ITEM_ADD_PAOPAO;
var I_POWER = constants.ITEM_ADD_POWER;
var I_SCORE = constants.ITEM_ADD_SCORE;
var I_SPEED = constants.ITEM_ADD_SPEED;

//背景地图
var backGroundMap = [ 
    [  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1 ], 
    [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND,  S_W_1 ],
    [  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1 ],
    [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND,  S_W_1 ],
    [  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1 ],
    [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND,  S_W_1 ],
    [  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1 ],
    [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND,  S_W_1 ],
    [  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1, GROUND,  S_W_1 ],
    [  S_W_1, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND, GROUND,  S_W_1 ],
    [  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1,  S_W_1 ]
 ];




 var TDMap = function(mapName){

    this.map = backGroundMap;

    this.getXLen = function(){
        return this.map[0].length;
    }

    this.getYLen = function(){
        return this.map.length;
    }

    this.getValue = function(x,y){
        return this.map[x][y];
    }

    this.setValue = function(x,y,value){
        this.map[x][y] = value;
    }

    this.isPositionPassable = function(x,y){
        if(this.getValue(x,y)==0 || this.getValue(x,y)>100) return true;
        return false;
    }

    this.isPositionAnItem = function(x,y){
        if(this.getValue(x,y)>100) return true;
        return false;
    }
 }

 module.exports = {
     TDMap : TDMap
 }
