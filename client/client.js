
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
	
		// Convert the object of fields to a list
		var fieldNodes = _.map(_.keys(metaCollection.fields), function(fieldNodeKey){
			var thisNode = metaCollection.fields[fieldNodeKey];
			thisNode.key = _.last(fieldNodeKey.split('#'));
			thisNode.hierarchy = fieldNodeKey;
			
			return thisNode;
			
		});
		
		// Add some styling bits
		_.forEach(fieldNodes, function(thisNode, idx){
			var prevNode = fieldNodes[idx - 1];
			var nextNode = fieldNodes[idx + 1];
			
			if(!nextNode || nextNode.depth != thisNode.depth){
				thisNode.roundBLcorner = true;
			}
			
			if(!prevNode || prevNode.depth > thisNode.depth){
				thisNode.roundTLcorner = true;
			}
			
			if(idx % 2){
				thisNode.zebraBg = true;
			}
			
		});
		
		return fieldNodes;
	}

});

Template.progressBar.events({

  "click .progress-bar": function(e, t) {

    e.preventDefault();

    var hierarchy = t.data.hierarchy;
    var type = t.data.type;
    
    var path = hierarchy.replace(/#/g, '.');

    var query = {}
    if(type === "undefined") {
      query[path] = { $exists: false }
      query = '"'+ path + '" : {$exists: false} ';
    } else {
      //TODO add type dependent logic for mongo query
      //query[path] = { $exists: true }
      query = '"' + path + '" : {$exists: true} ';
    }

		var colName = FlowRouter.getParam('collectionName');

    Session.set('queryString', query);
    Session.set('paramString', "");

//    FlowRouter.go('/'+colName+'/query');
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
                   hierarchy: self.hierarchy,
                   number: self.total,
                   percent: Math.round(100*(value/self.total)),
                   totalPercent: Math.round(100*(value/totalCount))});
    });
    types.push({type: 'undefined',
                hierarchy: self.hierarchy,
                number: totalCount - self.total,
                percent: Math.round(100-(100*(self.total/totalCount))),
                totalPercent: Math.round(100-(100*(self.total/totalCount)))});

    return types;
  }
});

Template.sidebar.helpers({
	collections: function(){
		return Meta.find({}, { sort: { name: 1 }});
	}
});

