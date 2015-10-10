
Template.collectionDocs.helpers({
	
	collectionName: function(){
		// Todo the whole thing
		return FlowRouter.getParam('collectionName');
	},
	
	collectionDocs: function(){
		return [{
			foo: 123,
			bar: 234,
			baz: 414
		},{
			foo: 123,
			bar: 234,
			baz: 414
		},{
			foo: 123,
			bar: 234,
			baz: 99999
		}];
	}
	
});

Template.collectionDetail.helpers({
	
	collectionName: function(){
		// Todo the whole thing
		return FlowRouter.getParam('collectionName');
	},
	
	fields: function(){
		return [{
			"hello": {count:3},
			"foo": {count:2},
			"test": {count:2}
		}];
	}
	
});

Template.sidebar.helpers({
	collections: function(){
		return Meta.find({}, { sort: { name: 1 }});
	}
});

