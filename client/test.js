

Template.test.created = function() {

  Meteor.call('test', function(err, res) {
    Session.set('collectionNames', res);
  });
}

Template.test.helpers({
  collections: function () {
    return Session.get('collectionNames');
  }
});

Template.collectionRow.events({
  'click .collectionRow': function (e, t) {
    Session.set('selectedCollection', t.data);
    Meteor.call('analyzeCollection', t.data);
  }
});


Template.collectionRow.helpers({

  selected: function() {

    var current = Session.get('selectedCollection');

    var name = Template.instance().data;

    if(current == name) {
      return true;
    } else {
      return false;
    }
  }
});
