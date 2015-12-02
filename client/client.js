
DETAILED_VIEW_TYPES = "types";
DETAILED_VIEW_VALUES = "values";

COLLECTION_VIEW_QUERY = "query";
COLLECTION_VIEW_DETAILS = "details";

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
Template.collectionView.created = function() {

  this.metaHandle = Meteor.subscribe('metaCollections');
}
Template.collectionView.destroyed = function() {
  
  this.metaHandle.stop();
}
*/

Template.collectionView.onCreated(function(){

	setTimeout(function(){
		$('[data-toggle="tooltip"]').tooltip();
	}, 1000);
});

Template.details.events({
  "click .select-types": function(e, t) {
    Session.set('analysisViewType', DETAILED_VIEW_TYPES);
  },
  "click .select-values": function(e, t) {
    Session.set('analysisViewType', DETAILED_VIEW_VALUES);
  },
});
Template.collectionView.events({
  "click .toggle-details": function(e, t) {
		var colName = FlowRouter.getParam('collectionName');
    FlowRouter.go('/'+colName+'/details');
  },
  "click .toggle-query": function(e, t) {
    Session.set('collectionViewType', COLLECTION_VIEW_QUERY);
		var colName = FlowRouter.getParam('collectionName');
    FlowRouter.go('/'+colName+'/query');
  },
});

Template.collectionView.helpers({
  queryView: function() {
    var view = Session.get('collectionViewType');
    if(!view || view == COLLECTION_VIEW_QUERY) {
      return true;
    } else {
      return false;
    }
  },
  detailsView: function() {
    var view = Session.get('collectionViewType');
    if(!view || view == COLLECTION_VIEW_DETAILS) {
      return true;
    } else {
      return false;
    }
  },
	collectionName: function(){
		// Todo the whole thing
		return FlowRouter.getParam('collectionName');
	}
});

Template.details.helpers({
  typesView: function() {
    var view = Session.get('analysisViewType');
    if(!view || view == DETAILED_VIEW_TYPES) {
      return true;
    } else {
      return false;
    }
  },
  valuesView: function() {
    var view = Session.get('analysisViewType');
    if(!view || view == DETAILED_VIEW_TYPES) {
      return false;
    } else {
      return true;
    }
  },
  docCount: function() {
    var metaCollection = Meta.findOne({
			name: FlowRouter.getParam('collectionName')
		});
    if(metaCollection.totalCount) {
      return metaCollection.totalCount;
    } else {
      return null;
    }
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

Template.valueBar.events({

  "click .progress-bar": function(e, t) {

    e.preventDefault();

    console.log(t.data);
    var hierarchy = t.data.hierarchy;
    var type = t.data.type;
    var value = t.data.value;
    var valType = t.data.valType;
    
    var path = hierarchy.replace(/#/g, '.');

    var query = {}
    if(valType === "string") {
      query = '"'+ path + '" : "' + value + '"';
    } else if(valType === "boolean" || valType === "number") {
      query = '"'+ path + '" : ' + value;
    } else if(valType === "undefined") {
      query = '"'+ path + '" : {$exists: false} ';
    } else {
      //TODO add type dependent logic for mongo query
      //query[path] = { $exists: true }
      query = '"' + path + '" : {$exists: true} ';
    }

		var colName = FlowRouter.getParam('collectionName');

    Session.set('queryString', query);
    Session.set('paramString', "");

    FlowRouter.go('/'+colName+'/query');
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

    FlowRouter.go('/'+colName+'/query');
  }
});
Template.fieldNode.helpers({
  typesView: function() {
    var view = Session.get('analysisViewType');
    if(!view || view == DETAILED_VIEW_TYPES) {
      return true;
    } else {
      return false;
    }
  },
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
  },
  values: function() {
    var self = this;

		var metaCollection = Meta.findOne({
			name: FlowRouter.getParam('collectionName')
		});

    if(!metaCollection){
			// Mongo probably hasn't sank yet
			return 0;
		}
    var totalCount = metaCollection.totalCount;

    console.log(self);
    var total = 0;
    var values = [];
    if(self.valType == "unique") {
      values.push({ value: 'unique',
                    valType: 'unique',
                        hierarchy: self.hierarchy,
                        number: self.total,
                        percent: Math.round((100*(self.total/totalCount))),
                        totalPercent: Math.round((100*(self.total/totalCount)))});
    } else if(self.valType == "object") {
      values.push({ value: 'object',
                    valType: 'object',
                        hierarchy: self.hierarchy,
                        number: self.total,
                        percent: Math.round((100*(self.total/totalCount))),
                        totalPercent: Math.round((100*(self.total/totalCount)))});
    } else {
      _.each(this.vals, function(count, value) {

        values.push({  value: value, 
                       valType: self.valType,
                       hierarchy: self.hierarchy,
                       number: count,
                       percent: Math.round(100*(count/self.total)),
                       totalPercent: Math.round(100*(count/totalCount))});
      });
    }
    values.push({  value: 'undefined',
                  valType: 'undefined',
                  hierarchy: self.hierarchy,
                  number: totalCount - self.total,
                  percent: Math.round(100-(100*(self.total/totalCount))),
                  totalPercent: Math.round(100-(100*(self.total/totalCount)))});

    return values;
  }
});

Template.sidebar.helpers({
	collections: function(){
		return Meta.find({}, { sort: { name: 1 }});
	}
});

Template.documentDetail.created = function() {

  var colName = FlowRouter.getParam('collectionName');

  var docId = FlowRouter.getParam('documentId');

  this.docHandle = Meteor.subscribe('doc', colName, docId);
}
Template.documentDetail.destroyed = function() {
  
  this.docHandle.stop();
}

Template.documentDetail.helpers({

  docId: function() {

		var docId = FlowRouter.getParam('documentId');

    return docId;
  },
  doc: function() {
		
    var colName = FlowRouter.getParam('collectionName');
  
    var selectedCollection = Mongo.Collection.get(colName);

    var docId = FlowRouter.getParam('documentId');

    var doc = selectedCollection.findOne(docId);

    return doc;
  }
});







