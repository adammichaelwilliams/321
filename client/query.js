
DEFAULT_QUERY = "_id: {$exists: true}";
DEFAULT_PARAM = "limit: 1";

Template.query.created = function() {
  var self = this;

	var collectionName = FlowRouter.getParam('collectionName');
  if(!Session.get("queryString") || !Session.get("paramString")) {

    var queryString = DEFAULT_QUERY;
    var paramString = DEFAULT_PARAM;
    Session.set("queryString", queryString);
    Session.set("paramString", paramString);
  }

  self.autorun( function() {
    Meteor.subscribe("queryResult", FlowRouter.getParam('collectionName'), Session.get('queryString'), Session.get('paramString'));
  });
  
}

Template.documentRow.helpers({

  prettyDoc: function() {
    return JSON.stringify(this, null, 4);
  }
});
Template.query.helpers({
  queryString: function() {
    var queryString = Session.get('queryString');
    return queryString;
  },
  paramString: function() {
    var paramString = Session.get('paramString');
    return paramString;
  },
  collectionName: function() {
	  var collectionName = FlowRouter.getParam('collectionName');
    return collectionName;
  },
  upperCollectionName: function() {
	  var collectionName = FlowRouter.getParam('collectionName');
    var string = collectionName;
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  },
  numResultString: function() {

	  var collectionName = FlowRouter.getParam('collectionName');
    var selectedCollection = Mongo.Collection.get(collectionName);
    var queryString = Session.get('queryString');
    var paramString = Session.get('paramString');

    try {
      //eval("var query = " + queryString);
      eval("var query = {" + queryString +"}");
    } 
    catch(err) {
      console.log(err);
      query = {}
    }
    
    var params;
    try {
      //eval("var params = " + paramString);
      eval("var params = {" + paramString + "}");
    } 
    catch(err) {
      console.log(err);
      params = {}
    }

    var num = selectedCollection.find(query, params).count();
    var resultString;
    if(num <= 0) {
      resultString = "No documents found";
    } else if (num == 1) {
      resultString = "1 document found";
    } else {
      resultString = num + " documents found";
    }
    
    return resultString;
  },
  queryResults: function() {
	  var collectionName = FlowRouter.getParam('collectionName');
    var selectedCollection = Mongo.Collection.get(collectionName);

    var queryString = Session.get('queryString');
    var paramString = Session.get('paramString');

    try {
      //eval("var query = " + queryString);
      eval("var query = {" + queryString +"}");
    } 
    catch(err) {
      console.log(err);
      query = {}
    }
    
    var params;
    try {
      //eval("var params = " + paramString);
      eval("var params = {" + paramString + "}");
    } 
    catch(err) {
      console.log(err);
      params = {}
    }

    return selectedCollection.find(query, params);
  }
});

Template.query.events({

  'submit #runQuery': function(e, t) {

    e.preventDefault();

    var queryString = t.find('input#query').value;
    
    var paramString = t.find('input#params').value;

    if(!queryString) {
      queryString = "";
      t.find('input#query').value = queryString;
    }
    if(!paramString) {
      paramString = "";
      t.find('input#params').value = paramString;
    }

    try {
      //eval("var query = " + queryString);
      eval("var query = {" + queryString +"}");
    } 
    catch(err) {
      //TODO set error state here
      queryString = DEFAULT_QUERY;
      t.find('input#query').value = queryString;
    }
    
    var params;
    try {
      eval("var params = {" + paramString + "}");
    } 
    catch(err) {
      paramString = DEFAULT_PARAM;
      t.find('input#params').value = paramString;
    }

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

