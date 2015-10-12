
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

Tracker.autorun(function() {
  Meteor.subscribe('metaCollections');
});

/*
Template.collectionDetail.created = function() {

  this.metaHandle = Meteor.subscribe('metaCollections');
}
Template.collectionDetail.destroyed = function() {
  
  this.metaHandle.stop();
}
*/


Template.collectionDetail.helpers({

	collectionName: function(){
		// Todo the whole thing
		return FlowRouter.getParam('collectionName');
	},

	fields: function(){
		
		var metaCollection = Meta.findOne({
			name: FlowRouter.getParam('collectionName')
		});
		
		var dummyData = {
			'_id': { types: { string: 7, total: 7 }, depth: 1 },
			'b': { types: { object: 5, total: 5 }, depth: 1 },
			'b#1': { types: { boolean: 5, total: 5 }, depth: 2 },
			'b#2': { types: { object: 5, total: 5 }, depth: 2 },
			'b#2#c': { types: { boolean: 4, total: 4 }, depth: 3 },
			'b#2#d': { types: { object: 5, total: 5 }, depth: 3 },
			'b#2#d#1': { types: { boolean: 5, total: 5 }, depth: 4 },
			'b#2#d#2': { types: { boolean: 4, total: 4 }, depth: 4 },
			'name': { types: { string: 7, total: 7 }, depth: 1 },
			'a': { types: { object: 5, total: 5 }, depth: 1 },
			'a#1': { types: { boolean: 5, total: 5 }, depth: 2 },
			'a#2': { types: { boolean: 3, total: 3 }, depth: 2 }
		};
		
		var fieldNodes = _.map(_.keys(dummyData), function(fieldNodeKey){
			var thisNode = dummyData[fieldNodeKey];
			thisNode.key = _.last(fieldNodeKey.split('#'));
			return thisNode;
		});
		
		return fieldNodes;
	}

});

Template.sidebar.helpers({
	collections: function(){
		return Meta.find({}, { sort: { name: 1 }});
	}
});

