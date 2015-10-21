

Meteor.startup(function () {
  // code to run on server at startup
});


// publish posts
Meteor.publish('queryResult', function(collectionName, queryString, parameterString) {
  
  var selectedCollection = Mongo.Collection.get(collectionName);

  var query;
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
    //eval("var params = " + parameterString);
    eval("var params = {" + paramString + "}");
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

    var hdfTree = {};

    var RecursiveIterator = Meteor.npmRequire('recursive-iterator');

    collection.find({}).forEach(function(doc) {
//      console.log(doc);
      //traverse(doc, process);
      var iterator = new RecursiveIterator(doc);
      for(var item = iterator.next(); !item.done; item = iterator.next()) {
          var state = item.value;
          console.log(state.path.join('.'), state.node);

          var path = state.path.join('.');
          var hashPath = state.path.join('#');

          var value = state.node;

          var type = typeof value;

          //TODO
          //- isArray
          //- isObject
          //- isArguments
          //- isFunction
          //- isString
          //- isNumber
          //- isFinite
          //- isBoolean
          //- isDate
          //- isRegExp
          //- isNaN
          //- isNull
          //- isUndefined
          if(type === 'object') {

            //Example:
            if(_.isArray(type)) {
              type = "array";
            }
          }

          console.log("type: ");
          console.log(type);
          
          var depth = state.path.length - 1; //0 based depth
          if(hdfTree[hashPath] && hdfTree[hashPath].types) {
            if(hdfTree[hashPath].types[type]) {
              hdfTree[hashPath].types[type]++
            } else {
              hdfTree[hashPath].types[type] = 1;
            }
            hdfTree[hashPath].total++;
          } else {
            hdfTree[hashPath] = {};
            hdfTree[hashPath].types = {};
            hdfTree[hashPath].depth = depth;
            hdfTree[hashPath].types[type] = 1;
            hdfTree[hashPath].total = 1;
          }
      }
    });

    console.log(hdfTree);

    var totalCount = collection.find({}).count();
    console.log("total docs: " + totalCount);

    Meta.update({name: name}, {
      $set: { 
        fields: hdfTree,
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

