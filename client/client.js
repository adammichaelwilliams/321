
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
		
		var dummyData = [
			{
				'key': 'propertyType',
				'types': {
					'string': 9,
					'integer': 49,
					'object': 19,
					'not-found': 4,
					'total': 104
				},
				'children': [
					{
						'key': 'houseType',
						'types': {
							'string': 94,
							'not-found': 4,
							'total': 95
						}
					},
					{
						'key': 'acreage',
						'types': {
							'string': 94,
							'total': 99
						}
					}
				]
			},
			{
				key: 'secondTopKey',
				types: {
					'string': 4,
					'total': 4
				}
			}
		]
		
		var metaCol = Meta.findOne({name:FlowRouter.getParam('collectionName')});
		
		var fields = _.each(dummyData, function(val,key){
			//
		});

		return fields;
	}

});

Template.sidebar.helpers({
	collections: function(){
		return Meta.find({}, { sort: { name: 1 }});
	}
});

