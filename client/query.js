

Template.query.created = function() {
  var self = this;

  var queryString = "{}";
  var paramString = "{ limit: 1 }";
  Session.set("queryString", queryString);
  Session.set("paramString", paramString);

  self.autorun( function() {
    Meteor.subscribe("queryResult", 'cities', Session.get('queryString'), Session.get('paramString'));
  });
  
  console.log('query template initialized');
}

Template.query.helpers({

  queryResults: function() {
    var selectedCollection = Mongo.Collection.get('cities');

    var query = JSON.parse(Session.get('queryString'));
    var params = JSON.parse(Session.get('parameterString'));

    return selectedCollection.find(query, params);
  }
});

Template.query.events({

  'submit #runQuery': function(e, t) {

    e.preventDefault();
    console.log(t);

    var queryString = "{}";
    var paramString = "{ limit: 1 }";

    //Todo: add query validation step, add auto-limiting, pagination, etc
    //Do this by sending the query to the server, validate it, run some stats 
    //(how many results, execution time, etc) and then return to the client.
    //The client then subscribes to that query
    /*
    Meteor.call(runQuery, queryString, function(err, res) {

    });
    */
    Session.set("queryString", queryString);
    Session.set("paramString", paramString);
  }
});

