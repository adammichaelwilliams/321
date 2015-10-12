

Meteor.startup(function () {
  // code to run on server at startup
});


// publish posts
Meteor.publish('queryResult', function(collectionName, queryString, parameterString) {
  
  var selectedCollection = Mongo.Collection.get(collectionName);

  var query;
  try {
    eval("var query = " + queryString);
  } 
  catch(err) {
    console.log(err);
    query = {}
  }
  
  var params;
  try {
    eval("var params = " + parameterString);
  } 
  catch(err) {
    console.log(err);
    params = {}
  }

  if(!query) {
    query = {};
  }
  if(!params) {
    params = {};
  }
//  console.log(JSON.stringify(parameterString));

  var cursor;
  try {
    cursor = selectedCollection.find(query, params);
    //cursor = selectedCollection.find(query, parameterString);
  }
  catch(err) {
    console.log(err);
    cursor = [];
  }
  return cursor;
//  return selectedCollection.find({}, {limit: 1});
});

Meteor.publish('metaCollections', function() {

  return Meta.find({});
});


Meteor.methods({
 
  updateMetaCollections: function() {
    var mongoCollections = Mongo.Collection.getAll();

    if(!mongoCollections) {
      console.log("no collections?");
      return null;
    }

    var collectionNames = [];

    _.each(mongoCollections, function(collection) {

		// this doesnt have find
      //console.log(collection.find().count());
	  
      if(collection.name != "meta321" &&
         collection.name != "meteor_autoupdate_clientVersions" &&
         collection.name != "meteor_accounts_loginServiceConfiguration") {

        Meta.upsert({name: collection.name}, {
          $set: {
            name: collection.name
          }
        });
        collectionNames.push(collection.name);
        Meteor.call('analyzeCollection', collection.name);
      }
    });

    return collectionNames;
  },

  analyzeCollection(name) {

    if(!name) {
      console.log("no collection name!");
      return null;
    }

    var collection = Mongo.Collection.get(name)

    if(!collection) {
      console.log("no collection found!");
      return null;
    }

    //start analyzing collection (async)

    var generalDoc = {};
    var dummyDoc = {};

    var RecursiveIterator = Meteor.npmRequire('recursive-iterator');

    collection.find({}).forEach(function(doc) {
//      console.log(doc);
      //traverse(doc, process);
      var iterator = new RecursiveIterator(doc);
      for(var item = iterator.next(); !item.done; item = iterator.next()) {
          var state = item.value;
          console.log(state.path.join('.'), state.node);

          var path = state.path.join('.');
          var dummyPath = state.path.join('#');

          
          //if(index(generalDoc, state.path)) {
          if(generalDoc[path]) {
            generalDoc[path].count++;
          } else {
            generalDoc[path] = {
              count: 1
            }
          }
          if(dummyDoc[dummyPath]) {
            dummyDoc[dummyPath].count++;
          } else {
            dummyDoc[dummyPath] = {
              count: 1
            }
          }

      }
    });

    var str = JSON.stringify(generalDoc, null, 2);
  
    var newDoc = {}; 
    _.each(generalDoc, function(val, key) {
//      var children = index(generalDoc, key);
      index(newDoc, key, {
        count: val.count,
//        children: children
      });
    }); 
    
    var str = JSON.stringify(newDoc, null, 2);
    console.log(str);

    var totalCount = collection.find({}).count();
    console.log("total docs: " + totalCount);

    Meta.update({name: name}, {
      $set: { 
        fields: newDoc,
        dummy: dummyDoc,
        totalCount: totalCount
      } 
    });
    
    //unblock()
    //update metadata document with progress
    //
    //finish analyzing collection, update metadata document
  }
});

function index(obj,is, value) {
    if (typeof is == 'string')
        return index(obj,is.split('.'), value);
    else if (is.length==1 && value!==undefined)
        return obj[is[0]] = value;
    else if (is.length==0)
        return obj;
    else
        return index(obj[is[0]],is.slice(1), value);
}

