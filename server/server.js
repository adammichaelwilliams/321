

Meteor.startup(function () {
  // code to run on server at startup
});

RecursiveIterator = Meteor.npmRequire('recursive-iterator');

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
	  
      Meta.upsert({name: collection.name}, {
        $set: {
			name: collection.name
		}
      });
      collectionNames.push(collection.name);
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


    collection.find({}).forEach(function(doc) {
//      console.log(doc);
      //traverse(doc, process);
      var iterator = new RecursiveIterator(doc);
      for(var item = iterator.next(); !item.done; item = iterator.next()) {
          var state = item.value;
          console.log(state.path.join('.'), state.node);

          var path = state.path.join('.');

          
          //if(index(generalDoc, state.path)) {
          if(generalDoc[path]) {
            generalDoc[path].count++;
          } else {
            generalDoc[path] = {
              count: 1
            }
          }
      }
    });

    var str = JSON.stringify(generalDoc, null, 2);
  
    var newDoc = {}; 
    _.each(generalDoc, function(val, key) {
      var str = JSON.stringify(generalDoc, null, 2);
      var str = JSON.stringify(newDoc, null, 2);
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

