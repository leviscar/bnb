//主画板
var Game = function (width, height) {
    this.Height = height;
    this.Width = width;
    
}

//Point位置对象
var Point = function (x, y) {

    //X轴坐标
    this.X = x;

    //Y轴坐标
    this.Y = y;

    return this;
}

//元素大小对象
var Size = function (width, height) {

    //宽度
    this.Width = width;

    //高度
    this.Height = height;
}

//生成随即ID
function randonID() {
    var guid = '';
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
    }
    return guid;
}

//系统线程
var Thread;
Thread = function (callback, timeout, param) {
    var args = Array.prototype.slice.call(arguments, 2);
    var _cb = function () {
        callback.apply(null, args);
    }

    var threadID = 0;

    //启动线程
    this.Start = function () {
        threadID = setInterval(_cb, timeout);
    }

    //停止线程
    this.Stop = function () {
        clearInterval(threadID);
    }
};


module.exports = {
    Game,
    Point,

}