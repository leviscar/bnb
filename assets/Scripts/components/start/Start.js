const com  = require('../../Common');

cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        rankBtn: cc.Button
    },

    onLoad: function(){
        if(!com.socket){
          let serverAdd = "http://" + com.host +":"+ com.port;
          let socket = window.io(serverAdd);
  
          com.socket = socket;
        }
        com.windowSize = cc.view.getVisibleSize();
        if(!com.userInfo.guid) com.userInfo.guid = this.guid();
        console.log(com.userInfo.guid);

        this.wxHandle = this.wxHandle.bind(this);
        this.socketHandle = this.socketHandle.bind(this);
        this.rankBtn.node.on('click',this.showRankList,this);

        this.background.setScaleX(com.windowSize.width/960);
        this.background.setScaleY(com.windowSize.height/640);
        cc.director.preloadScene("map", function () { cc.log("map scene preloaded"); }); 

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

        wx.getLaunchOptionsSync(res => {
          console.log('wx getLaunchOptionsSync')
          console.log(res);
          if(res.query.roomName){
              let roomId = res.query.roomName;
              com.socket.role = 'challenger';
              com.isMaster = false;
              com.socket.emit("joinRoom",{roomId:roomId,userInfo:com.userInfo});
          }
        })

        wx.onShow(res => {
          console.log('wx onshow')
          console.log(res);
          if(res.query.roomName){
              let roomId = res.query.roomName;
              com.roomId = roomId;
              com.socket.role = 'challenger';
              com.isMaster = false;
              com.socket.emit("joinRoom",{roomId:roomId,userInfo:com.userInfo});
          }
        })
    },

    wxShare: function () {
        wx.showShareMenu();
    },

    guid: function() {
        function S4() {
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },

    showRankList: function () {
        cc.find('Canvas/rankListPanel').emit('fade-in');
    },

    socketHandle: function () {
        let self = this;
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

        com.socket.on('playAgain',function (data) {
            cc.director.loadScene("start",function(){
                if(data.code === 1){
                  com.userInfos = data.userInfos;
                  cc.find('Canvas/waitPanel').emit('fade-in');
                  cc.find('Canvas/waitPanel').emit('loadMasterAvatar');
                  if(com.userInfos.length === 2) cc.find('Canvas/waitPanel').emit('loadChallengerAvatar');

                  com.userInfos.forEach(function (userInfo) {  
                      if(com.userInfo.guid === userInfo.guid){
                        if(userInfo.isMaster){
                          com.isMaster = true;
                          com.socket.role = 'master';
                        }else{
                          com.isMaster = false;
                          com.socket.role = 'challenger';
                        }
                      }
                  })
              }
            });
            
        });

        com.socket.on("start",function(data){
            let mapInfo = data.mapInfo;
            com.userInfos = [].concat(data.userInfos);
            com.FPS = data.FPS/2;
            cc.director.loadScene("map");
            com.mapInfo = mapInfo;

            console.log(com.mapInfo.roleStartPointArr);
            console.log(com.mapInfo.monsterStartPointArr);
      });
    }
});
