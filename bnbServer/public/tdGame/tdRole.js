var Point = require('./tdGame').Point
var TDMap = require('./tdMap').TDMap

//物体移动方向枚举
var Direction = {
    None: -1,
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
}

var Role = function(name, point){

    this.FPS = 20;

    this.currentDirection = Direction.None;
    this.isKeyDown = false;

    this.name = name;
    this.position = new Point(0,0);
    // this.Direction = 1; //down
    this.moveStep = 4;
    // threshold用于辅助玩家操作，如果太大的话可能有bug最好不要超过role border的一半，或者movestep的2倍
    this.threshold = 8;

    //用来检测旁边块是否可以移动
    this.roleBorder = 15.9;
    this.borderStep = 32;

    this.tdMap = null;


    this.getMap = function(){
        return this.tdMap;
    }

    this.setMap = function(tdMap){
        this.tdMap = tdMap;
    }

    this.setPosition = function(x, y){
        this.position.x = x;
        this.position.y = y;
    }

    this.getPosition = function(){
        return this.position;
    }

    animateInterval = 0;
    moveInterval = 0;

    //角色移动函数
    this.move = function(directionnum) {
        if (directionnum < 0 || directionnum > 3) return;
        // this.Stop();
        if(directionnum==this.currentDirection &&
            this.isKeyDown) return;
        
        this.stop();

        this.currentDirection = directionnum;
        this.isKeyDown = true;
        
        let self = this;

        //先移动一步
        // this.MoveOneStop(directionnum);
       
        //动画线程
        animateInterval = setInterval(function() {
            
        }, 500);

        //移动线程
        moveInterval = setInterval(function() {
            console.log('move');
            self.moveOneStop(directionnum);
        }, 1000/self.FPS);
    }

    this.moveOneStop = function(directionnum){
        console.log(this.getMapLocation(this.position.x,this.position.y));
        let leftBorder,rightBorder,upBorder,downBorder;
        let targetX,targetY;
        let threshold = this.threshold;
        switch (directionnum) {
            case Direction.Up:
                leftBorder = this.position.x - this.roleBorder;
                rightBorder = this.position.x + this.roleBorder;
                targetY = this.position.y + this.roleBorder + this.moveStep;
                if(this.isPositionPassable(leftBorder+threshold,targetY)
                    && this.isPositionPassable(rightBorder-threshold,targetY)){
                    this.position.y += this.moveStep;
                    if(!this.isPositionPassable(leftBorder,targetY)
                        || !this.isPositionPassable(rightBorder,targetY)){
                        this.position.x = this.getNormPosition(this.position.x,this.position.y).x;
                    }
                }
                break;
            case Direction.Down:
                leftBorder = this.position.x - this.roleBorder;
                rightBorder = this.position.x + this.roleBorder;
                targetY = this.position.y - this.roleBorder - this.moveStep;
                if(this.isPositionPassable(leftBorder+threshold,targetY)
                    && this.isPositionPassable(rightBorder-threshold,targetY)){
                    this.position.y -= this.moveStep;
                    if(!this.isPositionPassable(leftBorder,targetY)
                        || !this.isPositionPassable(rightBorder,targetY)){
                        this.position.x = this.getNormPosition(this.position.x,this.position.y).x;
                    }
                }
                break;
            case Direction.Left:
                downBorder = this.position.y - this.roleBorder;
                upBorder = this.position.y + this.roleBorder;
                targetX = this.position.x - this.roleBorder - this.moveStep;
                if(this.isPositionPassable(targetX, upBorder-threshold)
                    && this.isPositionPassable(targetX,downBorder+threshold)){
                    this.position.x -= this.moveStep;
                    if(!this.isPositionPassable(targetX, upBorder)
                        || !this.isPositionPassable(targetX,downBorder)){
                        this.position.y = this.getNormPosition(this.position.x,this.position.y).y;
                    }
                }
                break;
            case Direction.Right:
                downBorder = this.position.y - this.roleBorder;
                upBorder = this.position.y + this.roleBorder;
                targetX = this.position.x + this.roleBorder + this.moveStep;
                if(this.isPositionPassable(targetX, upBorder-threshold)
                    && this.isPositionPassable(targetX,downBorder+threshold)){
                    this.position.x += this.moveStep;
                    if(!this.isPositionPassable(targetX, upBorder)
                        || !this.isPositionPassable(targetX,downBorder)){
                        this.position.y = this.getNormPosition(this.position.x,this.position.y).y;
                    }
                }
                break;
        };
    }
        
    //停止移动
    this.stop = function(directionnum) {
        console.log('stop');
        if(directionnum != null){
            if(directionnum != this.currentDirection)
                return;
        }
        this.isKeyDown = false;
        this.currentDirection = Direction.None;
        clearInterval(animateInterval);
        clearInterval(moveInterval);
    }

    this.getMapLocation = function(x,y){

        xIndex = Math.round(x/32);
        yIndex = Math.round(y/32);

        let tdMap = this.getMap();

        if(tdMap ==null){
            console.log('map not set');
            return {}
        }

        return {x: tdMap.getYLen()-1-yIndex, y: xIndex};
    }

    this.isPositionPassable = function(x,y){
        let tdMap = this.getMap();
        let location = this.getMapLocation(x,y);
        return tdMap.isPositionPassable(location.x,location.y);
    }

    this.getNormPosition = function(x,y){
        return {x: Math.round(x/32)*32,y: Math.round(y/32)*32}
    }
    

    return this;
}

module.exports = {
    Role,
    Direction
}