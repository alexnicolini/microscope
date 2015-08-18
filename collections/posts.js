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
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    var postId = Posts.insert(post);

    return { _id: postId };
  },

  upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);

    var post = Posts.findOne(postId);
    if (!post) {
      throw new Meteor.Error('invalid', 'Post not found');
    }

    if (_.include(post.upvoters, this.userId)) {
      throw new Meteor.Error('invalid', 'Already upvoted this post');
    }

    Posts.update(post._id, {
      $addToSet: { upvoters: this.userId },
      $inc: { votes: 1 }
    });
  }
});