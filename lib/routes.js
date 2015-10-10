FlowRouter.route('/', {
	action: function(){
		BlazeLayout.render('mainLayout', {main: 'collectionsList'});
	},
	name: 'collectionsList'
});

FlowRouter.route('/:collectionName/details', {
	action: function(){
		BlazeLayout.render('mainLayout', {main: 'collectionDetail'});
	},
	name: 'collectionDetail'
});

FlowRouter.route('/:collectionName/documents', {
	action: function(){
		BlazeLayout.render('mainLayout', {main: 'collectionDocs'});
	},
	name: 'collectionDetail'
});

