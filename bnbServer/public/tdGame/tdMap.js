

//背景地图
var backGroundMap = [ 
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ],
    [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
 ];




 var TDMap = function(mapName){

    this.map = backGroundMap;

    this.getXLen = function(){
        return this.map[0].length;
    }

    this.getYLen = function(){
        return this.map.length;
    }

    this.isPositionPassable = function(x,y){
        if(this.map[x][y]) return true;
        return false;
    }
 }

 module.exports = {
     TDMap
 }