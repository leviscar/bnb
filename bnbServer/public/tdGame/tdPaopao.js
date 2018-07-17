require('./tdMap');
require('./tdPoint');
require('./tdRole');

var constants = require('./tdConst')

var uniquePosArray = function(arr){
    var resultArr = [];
    for(var i=0; i<arr.length; i++){
        var obj = arr[i];
        var flag = true;
        for(var j=0;j<resultArr.length;j++){
            if(resultArr[j].x == obj.x && resultArr[j].y == obj.y){
                flag = false;
            }
        }
        if(flag) resultArr.push(obj);
    }
    return resultArr;
}

var TDPaopao = function(position, power, role){
    this.isActive = true;
    this.position = position;
    this.power = power;
    this.role = role;
    this.map = this.role.getMap();
    this.map.setValue(position.x,position.y,constants.PAOPAO);
    this.game = this.role.game;

    console.log('paopao created at'+ this.position.x+","+this.position.y);

    var self = this;
    this.boomTimeout = setTimeout(function(){
        self.boom();
    },2000);

    this.clearBoomTimeout = function(){
        clearTimeout(this.boomTimeout);
    }

    this.calcItemPosibility = function(){
        return parseInt(Math.round());
    }

    this.boom = function(){
        console.log('paopao boom  at'+this.position.x+","+this.position.y);
        // this.role.deletePaopao(this);

        var result = this.findPaopaoBombXY(this.position);
        var boomPaopaoArr = result.boomPaopaoArr;
        var boomXYArr = result.boomXYArr;
        var boomBoxArr = result.boomBoxArr;
        var itemArr = [];

        // 终止泡泡爆炸动画
        for(var i =0; i<boomPaopaoArr.length; i++){
            var pos = boomPaopaoArr[i];
            var paopao = this.role.game.paopaoArr[pos.x][pos.y];
            if(paopao) paopao.clearBoomTimeout();
            this.role.game.paopaoArr[pos.x][pos.y] = null;
        }
        // 炸掉道具
        for(var i =0; i<boomXYArr.length; i++){
            var pos = boomXYArr[i];
            this.map.setValue(pos.x,pos.y,constants.GROUND);
            if(this.position.x = this.game.masterRole.position.x && this.position.y == this.game.masterRole.position.y) this.game.masterRole.die();
            if(this.position.x = this.game.challenger.position.x && this.position.y == this.game.challenger.position.y) this.game.challenger.die();
        }
        // 生成道具
        for(var i =0; i<boomBoxArr.length; i++){
            var pos = boomBoxArr[i];
            if(this.map.getValue(pos.x,pos.y)==constants.GIFT_WALL && this.calcItemPosibility()){
                var itemCode = 101 + parseInt(Math.random()*4);
                this.map.setValue(pos.x,pos.y,itemCode);
                itemArr.push({x:pos.x,y:pos.y,itemCode:itemCode});
            }
        }
        result['itemArr'] = itemArr;

        console.log(result);
        var game = this.role.game;
        game.broadcastMsg("boomInfo",result);

    };

    this.findPaopaoBombXY = function(currentMapLocation){
        if(this.isActive){
            this.isActive = false;
            var boomXYArr = [];
            var boomBoxArr = [];
            var boomPaopaoArr = [];
            //是否可以前进
            var canGo = {Up : true, Down : true, Left : true, Right : true};
            boomXYArr.push({x:currentMapLocation.x, y:currentMapLocation.y});
            boomPaopaoArr.push({x:currentMapLocation.x, y:currentMapLocation.y});

            for(var i=1; i<= power; i++){
                //向左
                if(currentMapLocation.y-i >= 0 ){
                    if(canGo.Left){
                        var calcX = currentMapLocation.x;
                        var caclY = currentMapLocation.y-i;
                        mapValue = this.map.getValue(calcX,caclY);
                        if(0 < mapValue && mapValue < 4){
                            canGo.Left = false;
                            // 处理箱子爆炸 先不随机刷礼物 最后再统一刷礼物
                            boomBoxArr.push({x:calcX, y:caclY});
                        }else if(4<= mapValue && mapValue < 100){
                            canGo.Left = false;
                            //无法被炸毁的东西，直接过
                        }else if(mapValue == 100){
                            canGo.Left = false;
                            //如果旁边是泡泡，将该泡泡的爆炸区域合并到现在
                            var nextPaopao = this.role.game.paopaoArr[calcX][caclY];
                            var nextResult = nextPaopao.findPaopaoBombXY({x:calcX,y:caclY});
                            if(nextResult){
                                boomXYArr = uniquePosArray(boomXYArr.concat(nextResult.boomXYArr));
                                boomBoxArr = uniquePosArray(boomBoxArr.concat(nextResult.boomBoxArr));
                                boomPaopaoArr = uniquePosArray(boomPaopaoArr.concat(nextResult.boomPaopaoArr));
                            }
                        }else{
                            boomXYArr.push({x:calcX, y:caclY});
                        }
                    }
                }
                //向右
                if(currentMapLocation.y+i < this.map.getYLen()){
                    if(canGo.Right){
                        var calcX = currentMapLocation.x;
                        var caclY = currentMapLocation.y+i;
                        mapValue = this.map.getValue(calcX,caclY);
                        if(0 < mapValue && mapValue < 4){
                            canGo.Right = false;
                            // 处理箱子爆炸 先不随机刷礼物 最后再统一刷礼物
                            boomBoxArr.push({x:calcX, y:caclY});
                        }else if(4<= mapValue && mapValue < 100){
                            canGo.Right = false;
                            //无法被炸毁的东西，直接过
                        }else if(mapValue == 100){
                            canGo.Right = false;
                            //如果旁边是泡泡，将该泡泡的爆炸区域合并到现在
                            var nextPaopao = this.role.game.paopaoArr[calcX][caclY];
                            var nextResult = nextPaopao.findPaopaoBombXY({x:calcX,y:caclY});
                            if(nextResult){
                                boomXYArr = uniquePosArray(boomXYArr.concat(nextResult.boomXYArr));
                                boomBoxArr = uniquePosArray(boomBoxArr.concat(nextResult.boomBoxArr));
                                boomPaopaoArr = uniquePosArray(boomPaopaoArr.concat(nextResult.boomPaopaoArr));
                            }
                        }else{
                            boomXYArr.push({x:calcX, y:caclY});
                        }
                    }
                }
                //向上
                if(currentMapLocation.x-i >= 0){
                    if(canGo.Up){
                        var calcX = currentMapLocation.x-i;
                        var caclY = currentMapLocation.y;
                        mapValue = this.map.getValue(calcX,caclY);
                        if(0 < mapValue && mapValue < 4){
                            canGo.Up = false;
                            // 处理箱子爆炸 先不随机刷礼物 最后再统一刷礼物
                            boomBoxArr.push({x:calcX, y:caclY});
                        }else if(4<= mapValue && mapValue < 100){
                            canGo.Up = false;
                            //无法被炸毁的东西，直接过
                        }else if(mapValue == 100){
                            canGo.Up = false;
                            //如果旁边是泡泡，将该泡泡的爆炸区域合并到现在
                            var nextPaopao = this.role.game.paopaoArr[calcX][caclY];
                            var nextResult = nextPaopao.findPaopaoBombXY({x:calcX,y:caclY});
                            if(nextResult){
                                boomXYArr = uniquePosArray(boomXYArr.concat(nextResult.boomXYArr));
                                boomBoxArr = uniquePosArray(boomBoxArr.concat(nextResult.boomBoxArr));
                                boomPaopaoArr = uniquePosArray(boomPaopaoArr.concat(nextResult.boomPaopaoArr));
                            }
                        }else{
                            boomXYArr.push({x:calcX, y:caclY});
                        }
                    }
                }
                //向下
                if(currentMapLocation.x+i < this.map.getXLen()){
                    if(canGo.Down){
                        var calcX = currentMapLocation.x+i;
                        var caclY = currentMapLocation.y;
                        mapValue = this.map.getValue(calcX,caclY);
                        if(0 < mapValue && mapValue < 4){
                            canGo.Down = false;
                            // 处理箱子爆炸 先不随机刷礼物 最后再统一刷礼物
                            boomBoxArr.push({x:calcX, y:caclY});
                        }else if(4<= mapValue && mapValue < 100){
                            canGo.Down = false;
                            //无法被炸毁的东西，直接过
                        }else if(mapValue == 100){
                            canGo.Down = false;
                            //如果旁边是泡泡，将该泡泡的爆炸区域合并到现在
                            var nextPaopao = this.role.game.paopaoArr[calcX][caclY];
                            var nextResult = nextPaopao.findPaopaoBombXY({x:calcX,y:caclY});
                            if(nextResult){
                                boomXYArr = uniquePosArray(boomXYArr.concat(nextResult.boomXYArr));
                                boomBoxArr = uniquePosArray(boomBoxArr.concat(nextResult.boomBoxArr));
                                boomPaopaoArr = uniquePosArray(boomPaopaoArr.concat(nextResult.boomPaopaoArr));
                            }
                        }else{
                            boomXYArr.push({x:calcX, y:caclY});
                        }
                    }
                }
            }
            return {boomXYArr:boomXYArr,boomBoxArr:boomBoxArr,boomPaopaoArr:boomPaopaoArr}
        }else{
            return null;
        }
        

    }

    return this;
}


module.exports = {
    TDPaopao:TDPaopao
}