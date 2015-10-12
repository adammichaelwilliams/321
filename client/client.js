
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

		var coolList = [];

		var col = Meta.findOne({name:FlowRouter.getParam('collectionName')});
		var fields =  _.each(col.dummy, function(val,key){

      var percent = (val.count / col.totalCount) * 100;
      var is100 = (percent == 100);
			coolList.push({
				key: _.last(key.split('#')),
				val: val,
				depth: key.split('#').length,
				perc: (val.count / col.totalCount) * 100,
        is100: is100 
			});
		});

		return coolList;
	}

});

Template.sidebar.helpers({
	collections: function(){
		return Meta.find({}, { sort: { name: 1 }});
	}
});
