Template.commentSubmit.onCreated(function() {
  Session.set('commentSubmitErros', {});
});

Template.commentSubmit.helpers({
  errorMessage: function (field) {
    return Session.get('commentSubmitErros')[field];
  },

  errorClass: function(field) {
    return !!Session.get('commentSubmitErros')[field] ? 'has-error' : '';    
  }
});

Template.commentSubmit.events({
  'submit form': function (e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=bodyText]');
    var comment = {
      body: $body.val(),
      postId: this._id
      // postId: template.data._id
    }

    var errors = {};
    if (! comment.body) {
      errors.bodyText = 'Please write some content';
      Errors.throw(errors.bodyText);
      return Session.set('commentSubmitErros', errors);
    }

    Meteor.call('commentInsert', comment, function(error, commentId) {
      if (error) {
        Errors.throw(error.reason);
        // throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});