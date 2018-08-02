const com  = require('../../Common');

cc.Class({
    extends: cc.Component,

    properties: {
        NewRoom:cc.Button,
        JoinRoom: cc.Button,
        addRoomPanel:cc.Sprite,
        joinRoomScrollView:cc.ScrollView,
        background: cc.Node,
        waitPanel: cc.Node
    },

    onLoad: function(){
        let serverAdd = "http://" + com.host +":"+ com.port;
        let socket = window.io(serverAdd);

        com.socket = socket;
        com.windowSize = cc.view.getVisibleSize();

        this.wxHandle = this.wxHandle.bind(this);
        this.socketHandle = this.socketHandle.bind(this);

        this.background.setScaleX(com.windowSize.width/960);
        this.background.setScaleY(com.windowSize.height/640);
        this.socketHandle();

        try{
          this.wxHandle();
          
        }catch(err){
          console.log('wx error:'+ err)
        }

        
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
              com.userInfo.nickName = res.userInfo.nickName;
              com.userInfo.avatarUrl = res.userInfo.avatarUrl;
              com.userInfo.gender = res.userInfo.gender;
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
    },

    wxShare: function () {
        wx.showShareMenu();
    },

    socketHandle: function () {

        com.socket.on('roomInfo',function (data) {
            com.userInfos = data.userInfos;

            if(com.isMaster&&data.code === 1){
                cc.find('Canvas/addRoomPanel').emit('fade-out');
                cc.find('Canvas/waitPanel').emit('fade-in');
                cc.find('Canvas/waitPanel').emit('loadMasterAvatar');
                if(com.userInfos.length === 2) cc.find('Canvas/waitPanel').emit('loadChallengerAvatar');
                
            }else if(data.code === 1){
              cc.find('Canvas/joinRoomScrollView').emit('fade-out');
                cc.find('Canvas/waitPanel').emit('fade-in');
                cc.find('Canvas/waitPanel').emit('loadMasterAvatar');
                cc.find('Canvas/waitPanel').emit('loadChallengerAvatar');
            }
        });

        com.socket.on("start",function(data){
            let mapInfo = data.mapInfo;
            com.userInfos = [].concat(data.userInfos);
            com.FPS = data.FPS/2;
            cc.director.loadScene("map");
            com.map.basicMap = mapInfo.arr;
      });
    }
});
