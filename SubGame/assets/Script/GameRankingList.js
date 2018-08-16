cc.Class({
    extends: cc.Component,

    properties: {
        rankingScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
        prefabRankItem: cc.Prefab,
        prefabGameOverRank: cc.Prefab,
        gameOverRankLayout: cc.Node,
        loadingLabel: cc.Node,// 加载文字
    },

    start: function (){
        this.removeChild();
        if (CC_WECHATGAME){
            window.wx.onMessage(data => {
                cc.log("接收主域发来消息：", data);
                if (data.messageType == 0){ // 移除排行榜
                    this.removeChild();
                } else if (data.messageType == 1){ // 获取好友排行榜
                    this.fetchFriendData(data.MAIN_MENU_NUM);
                } else if (data.messageType == 2){ // 提交得分
                    // this.submitScore(data.MAIN_MENU_NUM, data.score);
                }else if(data.messageType == 3){ // 绘制横向排行榜
                    this.addWinCount(0);
                    this.gameOverRank(data.MAIN_MENU_NUM);
                }else if (data.messageType == 4){// 获胜更新排行榜
                    this.addWinCount(1);
                    this.gameOverRank(data.MAIN_MENU_NUM);
                }
            });
        } else {
            this.fetchFriendData(1000);
        }
    },

    addWinCount: function (score){
        if (CC_WECHATGAME){
            window.wx.getUserCloudStorage({
                // 以key/value形式存储
                keyList: ["win","lose"],
                success: function (getres){
                    console.log("getUserCloudStorage", "success", getres);
                    let historyWinCount = 0;
                    let historyLoseCount = 0;

                    if (getres.KVDataList.length != 0){
                        historyWinCount = getres.KVDataList[0].value;
                        historyLoseCount = getres.KVDataList[1].value;
                    }

                    // 对用户托管数据进行写数据操作
                    window.wx.setUserCloudStorage({
                        KVDataList: [
                            {key: "win", value: parseInt(historyWinCount) + parseInt(score) + ""},
                            {key: "lose", value: parseInt(historyLoseCount) + ""}
                        ],
                        success: function (res){
                            console.log("setUserCloudStorage", "success", res);
                        },
                        fail: function (res){
                            console.log("setUserCloudStorage", "fail");
                        },
                        complete: function (res){
                            console.log("setUserCloudStorage", "ok");
                        }
                    });
                },
                fail: function (res){
                    console.log("getUserCloudStorage", "fail");
                },
                complete: function (res){
                    console.log("getUserCloudStorage", "ok");
                }
            });
        } else {
            cc.log("增加胜场");
        }
    },
    submitScore (MAIN_MENU_NUM, score){ // 提交得分
        if (CC_WECHATGAME){
            window.wx.getUserCloudStorage({
                keyList: ["win"], // 以key/value形式存储
                success: function (getres){
                    console.log("getUserCloudStorage", "success", getres);
                    window.wx.setUserCloudStorage({ // 对用户托管数据进行写数据操作
                        KVDataList: [
                            {key: MAIN_MENU_NUM, value: "" + score},
                            {key: "win", value: "" + score},
                            {key: "lose", value: "" + score}
                        ],
                        success: function (res){
                            console.log("setUserCloudStorage", "success", res);
                        },
                        fail: function (res){
                            console.log("setUserCloudStorage", "fail");
                        },
                        complete: function (res){
                            console.log("setUserCloudStorage", "ok");
                        }
                    });
                },
                fail: function (res){
                    console.log("getUserCloudStorage", "fail");
                },
                complete: function (res){
                    console.log("getUserCloudStorage", "ok");
                }
            });
        } else {
            cc.log("提交得分:" + MAIN_MENU_NUM + " : " + score);
        }
    },
    removeChild (){
        this.node.removeChildByTag(1000);
        this.rankingScrollView.node.active = false;
        this.scrollViewContent.removeAllChildren();
        this.gameOverRankLayout.active = false;
        this.gameOverRankLayout.removeAllChildren();
        this.loadingLabel.getComponent(cc.Label).string = "玩命加载中...";
        this.loadingLabel.active = true;
    },
    fetchFriendData (MAIN_MENU_NUM){
        this.removeChild();
        this.rankingScrollView.node.active = true;
        if (CC_WECHATGAME){
            wx.getUserInfo({
                openIdList: ["selfOpenId"],
                success: (userRes) => {
                    this.loadingLabel.active = false;
                    console.log("success", userRes.data);
                    const userData = userRes.data[0];

                    wx.getFriendCloudStorage({
                        keyList: [MAIN_MENU_NUM],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success", res);
                            const data = res.data;

                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0){
                                    return 0;
                                }
                                if (a.KVDataList.length == 0){
                                    return 1;
                                }
                                if (b.KVDataList.length == 0){
                                    return -1;
                                }

                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            for (let i = 0; i < data.length; i++){
                                const playerInfo = data[i];
                                const item = cc.instantiate(this.prefabRankItem);

                                item.getComponent("RankItem").init(i, playerInfo);
                                this.scrollViewContent.addChild(item);
                                if (data[i].avatarUrl == userData.avatarUrl){
                                    const userItem = cc.instantiate(this.prefabRankItem);

                                    userItem.getComponent("RankItem").init(i, playerInfo);
                                    userItem.y = -200;
                                    this.node.addChild(userItem, 1, 1000);
                                }
                            }
                            if (data.length <= 8){
                                const layout = this.scrollViewContent.getComponent(cc.Layout);

                                layout.resizeMode = cc.Layout.ResizeMode.NONE;
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    },

    gameOverRank (MAIN_MENU_NUM){
        this.removeChild();
        this.gameOverRankLayout.active = true;
        if (CC_WECHATGAME){
            wx.getUserInfo({
                openIdList: ["selfOpenId"],
                success: (userRes) => {
                    cc.log("success", userRes.data);
                    const userData = userRes.data[0];

                    wx.getFriendCloudStorage({
                        keyList: ["win","lose"],
                        success: res => {
                            cc.log("wx.getFriendCloudStorage success", res);
                            this.loadingLabel.active = false;
                            const data = res.data;

                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0){
                                    return 0;
                                }
                                if (a.KVDataList.length == 0){
                                    return 1;
                                }
                                if (b.KVDataList.length == 0){
                                    return -1;
                                }

                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            for (let i = 0; i < data.length; i++){
                                if (data[i].avatarUrl == userData.avatarUrl){
                                    if ((i - 1) >= 0){
                                        if ((i + 1) >= data.length && (i - 2) >= 0){
                                            const userItem = cc.instantiate(this.prefabGameOverRank);

                                            userItem.getComponent("GameOverRank").init(i - 2, data[i - 2]);
                                            this.gameOverRankLayout.addChild(userItem);
                                        }
                                        const userItem = cc.instantiate(this.prefabGameOverRank);

                                        userItem.getComponent("GameOverRank").init(i - 1, data[i - 1]);
                                        this.gameOverRankLayout.addChild(userItem);
                                    } else {
                                        if ((i + 2) >= data.length){
                                            const node = new cc.Node();

                                            node.width = 120;
                                            this.gameOverRankLayout.addChild(node);
                                        }
                                    }
                                    const userItem = cc.instantiate(this.prefabGameOverRank);

                                    userItem.getComponent("GameOverRank").init(i, data[i], true);
                                    this.gameOverRankLayout.addChild(userItem);
                                    if ((i + 1) < data.length){
                                        const userItem = cc.instantiate(this.prefabGameOverRank);
                                        // const userItem1 = cc.instantiate(this.prefabGameOverRank);

                                        userItem.getComponent("GameOverRank").init(i + 1, data[i + 1]);
                                        this.gameOverRankLayout.addChild(userItem);

                                        // userItem1.getComponent("GameOverRank").init(i + 2, data[i + 2]);
                                        // this.gameOverRankLayout.addChild(userItem1);
                                        if ((i - 1) < 0 && (i + 2) < data.length){
                                            const userItem = cc.instantiate(this.prefabGameOverRank);

                                            userItem.getComponent("GameOverRank").init(i + 2, data[i + 2]);
                                            this.gameOverRankLayout.addChild(userItem);
                                        }
                                    }
                                }
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                            this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                        },
                    });
                },
                fail: (res) => {
                    this.loadingLabel.getComponent(cc.Label).string = "数据加载失败，请检测网络，谢谢。";
                }
            });
        }
    },
});
