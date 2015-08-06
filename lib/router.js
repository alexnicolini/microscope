Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
    return Meteor.subscribe('posts'); 
  }
});

Router.route('/', {
  name: 'postsList'
});

Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() {
      return Posts.findOne({ _id: this.params._id });
    }
});

Router.route('/submit', {
  name: 'postSubmit'
});

var requireLogin = function() {
  if (! Meteor.user()) {
    return this.render('accessDenied');
  } else {
    return this.next();
  }
};

Router.onBeforeAction(requireLogin, {
  only: 'postSubmit'
});