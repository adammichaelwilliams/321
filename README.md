# 321

![alt text](http://i.imgur.com/Ly1UpxS.png)

![alt text](http://i.imgur.com/Jhj3AEs.png)

Schemas are hard, especially in the early stages of your project's evolution.

To make things worse, NoSQL databases like MongoDB make it easy to avoid a schema, requiring additional fortification tools to sit between your app and it's storage layer.

We often times write new code, adding new dimensions to our data, while properly checking to ensure that the view layers don't break for old objects that are missing these new parameters.

What happens when your data is stale? You migrate it!

You write code to search for that data and you transform it!

Or atleast that's what we did. 

321 is an admistrative level tool for discovering missing parameters across your data set(s) (and eventually making it easy to migrate that data). 

It's super simple. 

Just hook this Meteor app into your Mongo database, and, assuming you don't have a collection titled "meta321" it will automagically analyze the gaps in your data.

Built in [Tokyo](http://www.meetup.com/Meteor-Tokyo/events/225464906/) for the [Meteor Global Hackathon](http://info.meteor.com/blog/announcing-the-2015-meteor-global-distributed-hackathon)



