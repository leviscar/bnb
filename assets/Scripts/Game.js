

cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: cc.TiledMap
    },
    properties: {
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
        var socket = window.io("http://localhost:4000");
        this._player = this.node.getChildByName("player");
        console.log("game start");
        
        socket.on("roleInfo",function(data){
            
        });

    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
