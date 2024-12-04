var Scratch = Scratch||{};
Scratch.Accounts = Scratch.Accounts||{};

Scratch.Accounts.UpdateNewsletterSubscriptionView = Backbone.View.extend({
    events: {
        'change input[type="checkbox"]': 'handleUpdateSubscription',
        'submit input[type="checkbox"]': 'submitUpdateSubscription',
    },

    handleUpdateSubscription: function(e) {
        e.preventDefault();
        this.submitUpdateSubscription(e);
        return false;
    },

    submitUpdateSubscription: function(e) {
        e.preventDefault();

        var self = this;
        raw_form = this.$el.serializeArray();
        data_obj = {};
        for (var i=0; i<raw_form.length; i++) {
            data_obj[raw_form[i]['name']] = raw_form[i]['value'];
        }

        $.ajax({
            url: '/accounts/settings/update_subscription/',
            type: 'POST',
            data: data_obj,
        }).done(function(data) {
            if (data['success']) {
                self.subscriptionUpdateSuccess(data);
            } else {
                self.subscriptionUpdateFailure(data);
            }
        });
        return false;
    },

    subscriptionUpdateSuccess: function(data) {
        if (typeof data['msg'] !== 'undefined') {
            Scratch.AlertView.msg($('#alert-view'), {alert: 'info', msg: data['msg']})
        } else {
            Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: Scratch.ALERT_MSGS['update-subscription-success']});
        }
    },

    subscriptionUpdateFailure: function(data) {
        if (this.$('#id_subscription_status').attr('checked')) {
            this.$('#id_subscription_status').attr('checked', false);
        } else {
            this.$('#id_subscription_status').attr('checked', true);
        }
        Scratch.AlertView.msg($('#alert-view'), {alert: 'success', msg: data.errors[0]});
    }
});

$(function(){
    var subscription_view = new Scratch.Accounts.UpdateNewsletterSubscriptionView({
        el: '#update-subscription',
    });
});