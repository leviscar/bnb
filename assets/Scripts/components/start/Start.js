const com  = require('../../Common');

cc.Class({
    extends: cc.Component,

    properties: {
        NewRoom:cc.Button,
        JoinRoom: cc.Button,
        addRoomPanel:cc.Sprite,
        joinRoomScrollView:cc.ScrollView,
    },

    onLoad: function(){

        let serverAdd = "http://" + com.host +":"+ com.port;
        let socket = window.io(serverAdd);
        com.socket = socket;

        com.windowSize = cc.view.getVisibleSize();
        
        this.NewRoom.node.on('click',this.newRoom,this);
        this.JoinRoom.node.on('click',this.joinRoom,this);

        try {
          socket.on("start",function(data){
              
              cc.director.loadScene("map");
              com.map.basicMap = data.arr;
          });
        } catch (error) {
          console.error(error)
        }
    },
    newRoom: function(){
        console.log("newRoom");
        try {
          // this.wxHandle();
        } catch (error) {
          console.log("微信包出错");
          console.error(error);
        }
    },
    joinRoom: function(){
        console.log("joinRoom");
    },

    wxHandle: function () {
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
    }
});
