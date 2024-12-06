// Emulate legacy _gaq.push using GA4's dataLayer.
// Page views are now automatic and GA4/GTM are configured elsewhere,
// so this ignores all but a small subset of commands.
// This file is safe to include more than once.

window['_gaq'] = {
    /**
     * Emulate legacy _gaq.push using GA4's dataLayer.
     * Commands other than _trackEvent and _setCustomVar are ignored.
     * @param {Array} args The arguments passed to _gaq.push
     * @property {string} 0 - The command, like '_trackEvent'
     * @property {string} 1 - The event category, like 'how-to'
     * @property {string} 2 - The action, like 'load from url'
     * @property {string} 3 - The label, like 'getting-started'
     */
    push: function (args) {
        const command = args[0];
        let ga4Item;
        switch (command) {
        case '_trackEvent':
            // called like: _gaq.push(['_trackEvent', event, action, label]);
            ga4Item = {
                event: args[1],
                action: args[2],
                label: args[3]
            };
            break;
        case '_setCustomVar':
            // called like: _gaq.push(['_setCustomVar', index, name, value, opt_scope]);
            // We ignore the index and scope, since GA4 doesn't use them.
            ga4Item = {};
            ga4Item[args[2]] = args[3];
            break;
        default:
            // ignore this command
            return;
        }
        window['dataLayer'] = window['dataLayer'] || [];
        window['dataLayer'].push(ga4Item);
    }
};
