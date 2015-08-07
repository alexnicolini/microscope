Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function (userId, doc) {
    return ownsDocument(userId, doc);
  },
  remove: function (userId, doc) {
    return ownsDocument(userId, doc);
  }
});

Posts.deny({
  update: function (userId, post, fieldNames) {
    // may only edit the following two fields
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });


    if (Meteor.isServer) {
      Meteor._sleepForMs(5000);
      postAttributes.title += '(server)';
      // wait for 5 seconds
    } else {
      postAttributes.title += '(client)';
    }

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
     return {
       postExists: true,
       _id: postWithSameLink._id
     }
    }    

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var postId = Posts.insert(post);

    return { _id: postId };
  }
});