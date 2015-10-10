Cities = new Mongo.Collection("cities");
Houses = new Mongo.Collection("houses");

Meteor.startup(function() {
  if (Meteor.isServer) {
    if(Cities.find().count() == 0) {

      Cities.insert({
        name: 'Detroit',
        state: 'Michigan',
        url: 'https://en.wikipedia.org/wiki/Detroit'
      });
      Cities.insert({
        name: 'San Francisco',
        state: 'California',
        region: 'Bay Area',
        url: 'https://en.wikipedia.org/wiki/San_Francisco'
      });
      Cities.insert({
        name: 'New York'
      });
    }
  }
});
