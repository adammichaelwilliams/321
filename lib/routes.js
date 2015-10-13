function crawlCollections(){
	Meteor.call('updateMetaCollections')
}

FlowRouter.route('/', {
	action: function(){
		BlazeLayout.render('mainLayout', {main: 'collectionsList'});
	},
	triggersEnter: [crawlCollections],
	name: 'collectionsList'
});

FlowRouter.route('/:collectionName/details', {
	action: function(){
		BlazeLayout.render('mainLayout', {main: 'collectionDetail'});
	},
	triggersEnter: [crawlCollections],
	name: 'collectionDetail'
});

FlowRouter.route('/:collectionName/documents', {
	action: function(){
		BlazeLayout.render('mainLayout', {main: 'collectionDocs'});
	},
	triggersEnter: [crawlCollections],
	name: 'collectionDocs'
});

FlowRouter.route('/:collectionName/query', {
	action: function(){
		BlazeLayout.render('mainLayout', {main: 'query'});
	},
	name: 'query'
});

FlowRouter.route('/:collectionName/:documentId', {
	action: function(){
		BlazeLayout.render('mainLayout', {main: 'documentDetail'});
	},
	triggersEnter: [crawlCollections],
	name: 'documentDetail'
});

// TEST
FlowRouter.route('/test', {
	action: function(){
		BlazeLayout.render('test');
	},
	name: 'testpage'
});

