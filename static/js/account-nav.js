function setAccountNav(context){
    Scratch = Scratch || {};
    Scratch.INIT_DATA = Scratch.INIT_DATA || {};
    
    /*
     Initialize to cookies, in case the user is logged out, or account-nav.json is
     cached.  The cookie values in turn fall back to the defaults on 
     Scratch.INIT_DATA.TEMPLATE_CUES. If TEMPLATE_CUES exists in account-nav.json, then
     these values will be overwritten later.
    */
    for (var cue_name in Scratch.INIT_DATA.TEMPLATE_CUES) {
        try {
            var cue_value = ("; " + document.cookie).split('; cue_' + cue_name + '=')[1].split(';')[0];
            if (cue_value == 'true') {
                Scratch.INIT_DATA.TEMPLATE_CUES[cue_name] = true;
            } else if (cue_value == 'false') {
                Scratch.INIT_DATA.TEMPLATE_CUES[cue_name] = false;
            }
        } catch (error) {
            // :)
        }
    }

    for (var key in context) {
        if (Scratch.INIT_DATA.hasOwnProperty(key)) {
            Scratch.INIT_DATA[key] = context[key];
        }
    }

    var template = _.template($('#template-account-nav-logged-out').html());
    var MANDRILL_OUTAGE_START = 1578718800000; // Jan 11 2020 1200 ET
    var MANDRILL_OUTAGE_END = 1578747600000; // Jan 11 2020 0800 ET
    if (Date.now() >= MANDRILL_OUTAGE_START && Date.now() <= MANDRILL_OUTAGE_END) {
        $('.email-outage').show();
    }
    if(context['LOGGED_IN_USER']){
        // User is logged in
        template = _.template($('#template-account-nav-logged-in').html());
        $(function(){
            var create = $('#project-create');
            create.attr('href', create.attr('href').split('?')[0]);
        });


        if (context['LOGGED_IN_USER']['model']['has_outstanding_email_confirmation'] === true && 
            'confirmed_email' in Scratch.INIT_DATA.TEMPLATE_CUES && 
            Scratch.INIT_DATA.TEMPLATE_CUES.confirmed_email) {
            $('.confirm-email').show();
            $('#confirm-email-popup').click(function(){
                openResendDialogue();
            });
        }

        // keep in sync with privacy-banner.jsx in scratch-www
        var POLICY_UPDATE_START_TIME = 1684987200000; // May 25 2023 0000 ET
        var POLICY_UPDATE_END_TIME = 1686887999000; // Jun 15 2023 2359 ET
        if (Date.now() >= POLICY_UPDATE_START_TIME && Date.now() <= POLICY_UPDATE_END_TIME && !getCookie("scratchpolicyseen")) {
            $('.privacy-update').show();
        }
    } else if (Scratch.INIT_DATA.LOGGED_IN_USER.model) {
        // THIS IS HERE FOR BACKWARDS COMPATIBILITY PERTAINING TO RELEASE
        // 2.0.107, AND CACHING OF ACCOUNT-NAV.JSON.
        template = _.template($('#template-account-nav-logged-in').html());
        $(function(){
            var create = $('#project-create');
            create.attr('href', create.attr('href').split('?')[0]);
        });
        if (Scratch.INIT_DATA.LOGGED_IN_USER.model.has_outstanding_email_confirmation === true && 
            'confirmed_email' in Scratch.INIT_DATA.TEMPLATE_CUES && 
            Scratch.INIT_DATA.TEMPLATE_CUES.confirmed_email) {
            $('.confirm-email').show();
            $('#confirm-email-popup').click(function(){
                openResendDialogue();
            });
        }
        if (!getCookie("scratchpolicyseen")) {
            $('.privacy-update').show();
        }
        context['LOGGED_IN_USER'] = Scratch.INIT_DATA.LOGGED_IN_USER;
    }


    $('.account-nav').replaceWith(template(context));

    $(dispatchAccountNavReady);
}

function setAccountNavFromJson() {
var accountNavContext;
    $.ajax({
        url: Scratch.ROOT_URL + '/fragment/account-nav.json',
    }).done(function (data_json) {
        accountNavContext = JSON.parse(data_json);
        setAccountNav(accountNavContext);
    });
accountNavContext = "";
setAccountNav(accountNavContext);
}

var accountNavReady;
var dispatchAccountNavReady;

if(document.createEvent) { // non-IE
    accountNavReady = document.createEvent('Event');
    accountNavReady.initEvent('accountnavready', true, true);
    dispatchAccountNavReady = function () {
        document.dispatchEvent(accountNavReady);
    }
} else if (document.createEventObject) { // IE
    dispatchAccountNavReady = function () {
        document.documentElement.accountnavready++;
    }
}
setAccountNavFromJson();
