

Meteor.startup(function () {
  // code to run on server at startup
});


Meteor.publish('doc', function(colName, docId) {

  var selectedCollection = Mongo.Collection.get(colName);

  var docs = selectedCollection.find({_id: {$in: [docId]}});

  return docs;
});

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
    eval("var params = {" + parameterString + "}");
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

    var collectionSize = collection.find({}).count();

    //Throttle/threshold limits
    // set the amount of unique items allowed
    // this prevents the meta document from storing too many different
    // values from various fields
    // eventually this should be overridden on a per field basis
    // Another way to do this, would be to take the values for the first
    // say 5 documents, and then check to see if any other docs in that
    // collection have the same values in the field
    // This could incrementally ramp up to index all the values in that
    // field, allowing us to forget about this threshold hack altogether.
    var uniqueThreshold = 20; //for unique document fields

    var smallThreshold = collectionSize * 0.5; 
    //mark threshold at 50% of collectionSize if collection, less than 40 items
    if(smallThreshold < uniqueThreshold) {
      uniqueThreshold = smallThreshold;
    }

    collection.find({}).forEach(function(doc) {
//      console.log(doc);
      //traverse(doc, process);
      var iterator = new RecursiveIterator(doc);
      for(var item = iterator.next(); !item.done; item = iterator.next()) {
          var state = item.value;
          //console.log(state.path.join('.'), state.node);

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

          //console.log("type: ");
          //console.log(type);
          if(type === "string") {
            //https://docs.mongodb.org/manual/faq/developers/#faq-dollar-sign-escaping
            value = value.replace(/\./g, "\uff0E");
            value = value.replace(/\$/g, "\uff04");
          }

          var depth = state.path.length - 1; //0 based depth
          if(hdfTree[hashPath] && hdfTree[hashPath].types) {
            if(hdfTree[hashPath].types[type]) {
              hdfTree[hashPath].types[type]++
            } else {
              hdfTree[hashPath].types[type] = 1;
            }
            if(type === "string" || type === "boolean" || type === "number") {
              if(hdfTree[hashPath].vals[value]) {
                hdfTree[hashPath].vals[value]++;
              } else {
                hdfTree[hashPath].vals[value] = 1;
              }
            }
            if(hdfTree[hashPath].vals &&
               _.size(hdfTree[hashPath].vals) > uniqueThreshold) {
              hdfTree[hashPath].valType = "unique"; 
            }

            hdfTree[hashPath].total++;
          } else {
            hdfTree[hashPath] = {};
            hdfTree[hashPath].types = {};
            hdfTree[hashPath].depth = depth;
            hdfTree[hashPath].types[type] = 1;
            if(type === "string" || type === "boolean" || type === "number") {
              hdfTree[hashPath].valType = type;
              hdfTree[hashPath].vals = {};
              hdfTree[hashPath].vals[value] = 1;
            } else {
              hdfTree[hashPath].valType = "object";
            }

            hdfTree[hashPath].total = 1;
          }
      }
    });

    //console.log(hdfTree);

    var totalCount = collection.find({}).count();
    //console.log("total docs: " + totalCount);

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

