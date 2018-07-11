var Point = require('./tdGame').Point

//物体移动方向枚举
var Direction = {
    None: -1,
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
}

var Role = function(name, point){

    this.currentDirection = Direction.None;
    this.isKeyDown = false;

    this.name = name;
    this.position = new Point(0,0);
    // this.Direction = 1; //down
    this.MoveStep = 5;

    this.setPosition = function(x, y){
        this.position.X = x;
        this.position.Y = y;
    }

    this.getPosition = function(){
        return this.position;
    }

    animateInterval = 0;
    moveInterval = 0;

    //角色移动函数
    this.Move = function(directionnum) {
        if (directionnum < 0 || directionnum > 3) return;
        // this.Stop();
        if(directionnum==this.currentDirection &&
            this.isKeyDown) return;
        
        this.Stop();

        this.currentDirection = directionnum;
        this.isKeyDown = true;
        
        var t = this;
       
        //动画线程
        animateInterval = setInterval(function() {
            
        }, 500);

        //移动线程
        moveInterval = setInterval(function() {
            console.log(1);
            switch (directionnum) {
                case Direction.Up:
                    t.position.Y += t.MoveStep;
                    break;
                case Direction.Down:
                    t.position.Y -= t.MoveStep;
                    break;
                case Direction.Left:
                    t.position.X -= t.MoveStep;
                    break;
                case Direction.Right:
                    t.position.X += t.MoveStep;
                    break;
            }
        }, 40);
    }
        
    //停止移动
    this.Stop = function(directionnum) {
        if(directionnum != null){
            if(directionnum != this.currentDirection)
                return;
        }
        console.log(2);
        this.isKeyDown = false;
        this.currentDirection = Direction.None;
        clearInterval(animateInterval);
        clearInterval(moveInterval);
    }

    return this;
}

module.exports = {
    Role,
    Direction
}