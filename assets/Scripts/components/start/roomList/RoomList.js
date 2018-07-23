cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: cc.Node,
        scrollView:cc.ScrollView,
        roomCount: 0,
        totalCount: 0,
        spacing: 0,
        btnAddItem: cc.Button,
        btnRemoveItem: cc.Button,
    },
    // use this for initialization
    onLoad: function () {
    	this.content = this.scrollView.content;
        this.rooms = []; // array to store spawned items
    	this.initialize();
    },

    initialize: function () {
        this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
    }
});
