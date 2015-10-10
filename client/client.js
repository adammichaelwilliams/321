
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

