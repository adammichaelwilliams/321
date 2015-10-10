FlowRouter.route('/', {
	action: function(){
		BlazeLayout.render('main-layout', {main: 'collections-list'});
	},
	name: 'collectionsList'
});

FlowRouter.route('/:collectionName/analyze', {
	action: function(){
		BlazeLayout.render('main-layout', {main: 'collection-detail'});
	},
	name: 'collectionDetail'
});

FlowRouter.route('/:collectionName/documents', {
	action: function(){
		BlazeLayout.render('main-layout', {main: 'collection-docs'});
	},
	name: 'collectionDetail'
});

