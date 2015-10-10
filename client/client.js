
Template.collectionDetail.helpers({
	
	collection: function(){
		// Todo the whole thing
		return FlowRouter.getParam('collectionName');
	}
	
});

Template.collectionDocs.helpers({
	
	collection: function(){
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

