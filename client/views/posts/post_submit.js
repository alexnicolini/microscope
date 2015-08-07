Template.postSubmit.events({
  'submit form': function (e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    Meteor.call('postInsert', post, function(error, result) {
      // display de error to the user and abort
      if (error) {
        return alert(error.reason);
      }
    });

    Router.go('postsList');
  }
});