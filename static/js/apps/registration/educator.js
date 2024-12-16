$(function () {
  $('[data-control="educator-confirmation"]').on('click',function(e){
    $('#educator-login-dialog').modal('hide');
    e.preventDefault();
    if (Scratch.Registration.educatormodal) {
      Scratch.Registration.educatormodal.close();
    }

    // need to add "in" class to the modal in order address a problem
    // that Firefox has showing modals that include animation
    $('#educator-registration-confirm').addClass('in').modal('show');
  });

  $('[data-control="educator-registration"]').on('click',function(e){
    $('#educator-login-dialog').modal('hide');
    /* TODO: MDG - Come up with a better way to handle slide off & on double animation */
    $('#educator-registration-confirm').modal('hide');
    e.preventDefault();
    if (Scratch.Registration.educatormodal) {
      Scratch.Registration.educatormodal.close();
    }

    $('#educator-registration').append($('<div id="educator-registration-data"/>'));
    Scratch.Registration.educatormodal =  new Scratch.Registration.educatorRegistrationView({el: '#educator-registration-data'});
    $('#educator-registration').modal('show');
  });

  $('#educator-registration-done').on('click', function(e) {
    _gaq.push(['_trackEvent', 'registration', 'register-complete']);
  });
});

Scratch.Registration.educatorRegistrationView=Scratch.Registration.RegistrationView.extend({

  postUrl: '/classes/register_educator/',
  modalUrl: '/classes/educator-modal-registration/',
  registrationStep: 4, // sumbit on this step triggers registration
  finalStep: 5, // submit on this step closes the registration modal
  totalSteps: 5, // used to set progress classes
  progressClass: "progress-5-", // used for progress-step class concatenation at the form level

  setFormProgress: function(){
    this.$('#registration-form').attr('class', 'progress' + this.step + ' progress-5-' + this.step);
  },
  validateFields: function() {
    if (this.step == 1) {
      this.validateUsername();
      this.validatePassword();
      this.validatePasswordMatch();
    } else if (this.step == 2) {
      this.validateBirthday();
      this.validateGenderInput();
      this.validateEmail();
      this.validateCountry();
    } else if (this.step == 3) {

    }
  },
  getRegistrationData: function(){
    return {
              username: this.$('.username').val(),
              password: this.$('.password').val(),
              birth_month: this.$('.birthmonth').val(),
              birth_year: this.$('.birthyear').val(),
              gender: this.$('input[name="gender"]:checked').val() || 'other',
              country: this.$('.country').val(),
              email: this.$('.email').val(),
              bio: this.$('.bio').val(),
              affiliation: this.$('.affiliation').val(),
              is_robot: this.$('input[name="yesno"]:checked').length > 0,
              should_generate_admin_ticket: this.$('.should-generate-admin-ticket').val(),
              usernames_and_messages: this.$('.usernames-and-messages').val(),
              csrfmiddlewaretoken: csrf,
            };
  },
  checkAge: function() {
    // override checkAge, since we don't need to switch to Parent/Guardian email
    // address for Educators
    return;
  },
});
