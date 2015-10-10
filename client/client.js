
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
		
		var coolList = [];
		
		var fields =  _.each(Meta.findOne({name:'bogus'}).dummy, function(val,key){
			
			coolList.push({
				key: _.last(key.split('#')),
				val: val,
				depth: key.split('#').length
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

