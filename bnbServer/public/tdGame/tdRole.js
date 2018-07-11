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

    this.FPS = 15;

    this.currentDirection = Direction.None;
    this.isKeyDown = false;

    this.name = name;
    this.position = new Point(0,0);
    // this.Direction = 1; //down
    this.moveStep = 32;

    //用来检测旁边块是否可以移动
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
        switch (directionnum) {
            case Direction.Up:
                if(this.isPostionPassable(this.position.x,this.position.y+this.moveStep)){
                    this.position.y += this.moveStep;
                }
                break;
            case Direction.Down:
                if(this.isPostionPassable(this.position.x,this.position.y-this.moveStep)){
                    this.position.y -= this.moveStep;
                }
                break;
            case Direction.Left:
                if(this.isPostionPassable(this.position.x-this.moveStep,this.position.y)){
                    this.position.x -= this.moveStep;
                }
                break;
            case Direction.Right:
                if(this.isPostionPassable(this.position.x+this.moveStep,this.position.y)){
                    this.position.x += this.moveStep;
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

    this.isPostionPassable = function(x,y){
        let tdMap = this.getMap();
        let location = this.getMapLocation(x,y);
        return tdMap.isPositionPassable(location.x,location.y);
    }
    

    return this;
}

module.exports = {
    Role,
    Direction
}