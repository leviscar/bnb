
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        itemID: 0
    },
    onLoad: function () {
        this.label.string = "hello";
        this.node.on('touchend', function () {
            console.log("Item " + this.itemID + ' clicked');
        }, this);
    },

    updateItem: function(tmplId, itemId) {
        this.itemID = itemId;
        this.label.string = "" + tmplId + ' Item#' + this.itemID;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
