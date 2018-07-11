

cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.TiledMap
    },
    properties: {

        // 这个属性引用了星星预制资源
        rolePrefab: {
            default: null,
            type: cc.Prefab
        },

        _isMapLoaded : {
            default: false,
            serializable: false,
        },
        groundLayerName: {
            default: 'ground'
        },
        blocksLayerName: {
            default: 'blocks'
        },
        giftsLayerName: {
            default: 'gifts'
        },
        barriersLayerName: {
            default: 'barriers'
        },

        player: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function(){
        let pos = cc.p(300,300);
        // let socket = window.io("http://localhost:4000");
        // this._player = this.node.getChildByName("player");
        console.log("game start");
        
        // socket.on("roleInfo",function(data){
            
        // });
        this.spawnNewRole(pos);

    },
    // LIFE-CYCLE CALLBACKS:
    spawnNewRole: function(pos) {
        
        let newRole = cc.instantiate(this.rolePrefab);

        this.node.addChild(newRole);

        newRole.setPosition(pos);
    },
    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
