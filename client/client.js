
Template.collectionDetail.helpers({
	
	collectionName: function(){
		// Todo the whole thing
		return FlowRouter.getParam('collectionName');
	},
	
	analyizationResults: function(){
	}
	
});

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
	jsonBlob: function(){
		return JSON.stringify(
			{
				"hello": "world",
				"foo": "bar",
				"test": {
					"open": 123
				}
			}
		, null, 4);
	}
});

Template.sidebar.helpers({
	collections: function(){
		return Meta.find({}, { sort: { name: 1 }});
	}
});

