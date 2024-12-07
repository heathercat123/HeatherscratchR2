$(function () {
  $('[data-control="student-registration"]').on('click',function(e){
    $('#student-login-dialog').modal('hide');
    e.preventDefault();
    if (Scratch.Registration.studentmodal) {
      Scratch.Registration.studentmodal.close();
    }
    $('#student-registration').append($('<div id="student-registration-data"/>'));
    Scratch.Registration.studentmodal =  new Scratch.Registration.StudentRegistrationView({el: '#student-registration-data'});
    $('#student-registration').modal('show');

  });

  $('#student-registration-done').on('click', function(e) {
    _gaq.push(['_trackEvent', 'registration', 'register-complete']);
  });
});

Scratch.Registration.StudentRegistrationView=Scratch.Registration.RegistrationView.extend({
    postUrl: '/classes/register_new_student/',
    modalUrl: '/classes/modal-registration/',

    submit: function(e) {
      if (this.step !== 0) {
          this.validateFields();
      }
      // move to the next page
      if (!this.hasErrors()) {
        if (this.step == 1) {
          this.$('.registration-next').hide();
          this.$('.modal-footer .buttons-right .ajax-loader').show();
          var self = this;
          $.withCSRF(function(csrf) {
            $.ajax({
              data: {
                username: self.$('.username').val(),
                password: self.$('.password').val(),
                should_generate_admin_ticket: self.$('.should-generate-admin-ticket').val(),
                usernames_and_messages: self.$('.usernames-and-messages').val(),
                classroom_id: Scratch.INIT_DATA.CLASSROOM.model.id,
                classroom_token: Scratch.INIT_DATA.CLASSROOM.model.token,
                csrfmiddlewaretoken: csrf
              },
              dataType: 'json',
              url: self.postUrl,
              type: 'post',
              success: self.onSubmit,
              error: self.onError,
            });
          });
          return;
        }
      this.nextStep();
      }
    },

  validateFields: function() {
    if (this.step == 1) {
      this.validateUsername();
      this.validatePassword();
      this.validatePasswordMatch();
    }
  },
});
