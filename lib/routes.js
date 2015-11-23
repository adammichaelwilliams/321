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
    Session.set('collectionViewType', COLLECTION_VIEW_DETAILS);
		BlazeLayout.render('mainLayout', {main: 'collectionView'});
	},
	triggersEnter: [crawlCollections],
	name: 'details'
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
    Session.set('collectionViewType', COLLECTION_VIEW_QUERY);
		BlazeLayout.render('mainLayout', {main: 'collectionView'});
	},
	triggersEnter: [crawlCollections],
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

