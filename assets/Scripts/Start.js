var com  = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        
        NewRoom:{
            default:null,
            type: cc.Button,
            visible: false
        },
        JoinRoom: cc.Button,
        addRoomPanel: {
            default:null,
            type: cc.Sprite
        },
        joinRoomScrollView: {
            default:null,
            type: cc.ScrollView,
            visible: false
        }

    },
    onLoad: function(){
        let serverAdd = "http://" + com.host +":"+ com.port;
        let socket = window.io(serverAdd);
        com.socket = socket;       

        this.NewRoom.node.on('click',this.newRoom,this);
        this.JoinRoom.node.on('click',this.joinRoom,this);

        // socket.on("roleInfo",function(data){
        //     console.log(data);
        // })

        socket.on("start",function(data){
            
            cc.director.loadScene("map");
        });
    },
    newRoom: function(event){

        wx.getSetting({
            success: (response) => {
              console.log(response)
              if (!response.authSetting['scope.userInfo']) {
                wx.authorize({
                  scope: 'scope.userInfo',
                  success: () => {
                    console.log('yes')
                  }
                })
              }
            }
          })

        wx.getUserInfo({
            success: res => {
              console.log(res);
            },
            fail:res=>{
              console.log(res);
            }
          })

        wx.login({
            success: function (res) {
              // res.code 为用户的登录凭证
              if (res.code) {
                // 游戏服务器处理用户登录
                console.log('微信登陆success');
              }
              else {
                // 失败处理
                console.log('获取用户登录态失败！' + res.errMsg);
              }
            },
            fail: function (res) {
              // 失败处理
              console.log('用户登录失败！' + res.errMsg);
            }
          }); 

        console.log("newRoom");
        com.socket.role = 'master';
        com.socket.emit("newRoom",{name:666});
    },
    joinRoom: function(event){
        console.log("joinRoom");
        com.socket.role = 'challenger';
        com.socket.emit("joinRoom",666);
        // cc.director.loadScene("map");
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
