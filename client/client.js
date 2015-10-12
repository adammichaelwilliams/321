
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

Template.collectionDetail.onCreated(function(){
	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip();
	}, 1000);
});


Template.collectionDetail.helpers({

	collectionName: function(){
		// Todo the whole thing
		return FlowRouter.getParam('collectionName');
	},

  fields: function(){
		
		var metaCollection = Meta.findOne({
			name: FlowRouter.getParam('collectionName')
		});
		
		if(!metaCollection){
			// Mongo probably hasn't sank yet
			return [];
		}
		
		var fieldNodes = _.map(_.keys(metaCollection.fields), function(fieldNodeKey){
			var thisNode = metaCollection.fields[fieldNodeKey];
			thisNode.key = _.last(fieldNodeKey.split('#'));
			return thisNode;
		});
		
		return fieldNodes;
	}

});

Template.fieldNode.helpers({
  types: function() {
    var self = this;

		var metaCollection = Meta.findOne({
			name: FlowRouter.getParam('collectionName')
		});

    if(!metaCollection){
			// Mongo probably hasn't sank yet
			return 0;
		}
    var totalCount = metaCollection.totalCount;

    var total = 0;
    var types = [];
    _.each(this.types, function(value, type) {

      types.push({ type: type, 
                   percent: (100*(value/self.total)),
                   totalPercent: (100*(value/totalCount))});
    });

    return types;
  }
});

Template.sidebar.helpers({
	collections: function(){
		return Meta.find({}, { sort: { name: 1 }});
	}
});

