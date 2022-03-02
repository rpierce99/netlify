/**
 * Puts boomerang data onto a Split event.
 * Requires a configured and initialized split javascript sdk to be on the page
 *
 * To configure, update beaconParamToCopy.
 *
 * Currently, beaconParamToCopy has a list of timing variables that this plugin pulls
 * from Boomerang regular beacons and includes in the Split event that is then sent to the Split SDK.
 * This set can be expanded, if desired, to include other variables that are present on the boomerang beacon.
 *
 * @class BOOMR.plugins.SplitSender
 */
 (function() {
    BOOMR = window.BOOMR || {};
    BOOMR.plugins = BOOMR.plugins || {};

    if (BOOMR.plugins.SplitSender) {
        return;
    }

    //
    // Use https://developer.akamai.com/mpulse/whats-in-a-beacon for reference
    // Key should match the "query string param"
    // Trailing 1 is not used
    //
    var beaconParamToCopy = {"rt.start":1,"rt.tstart":1,"rt.bstart":1,"rt.end":1,"t_resp":1,"t_page":1,"t_done":1,"r":1,"nt_red_cnt":1,"nt_nav_type":1,"nt_nav_st":1,"nt_red_st":1,"nt_red_end":1,"nt_fet_st":1,"nt_dns_st":1,"nt_dns_end":1,"nt_con_st":1,"nt_con_end":1,"nt_req_st":1,"nt_res_st":1,"nt_res_end":1,"nt_domloading":1,"nt_domint":1,"nt_domcontloaded_st":1,"nt_domcontloaded_end":1,"nt_domcomp":1,"nt_load_st":1,"nt_load_end":1,"nt_unload_st":1,"nt_unload_end":1,"nt_spdy":1,"nt_cinf":1,"nt_first_paint":1,"u":1,"v":1,"vis.st":1,"ua.plt":1,"ua.vnd":1};

    //
    // Private implementation
    //
    var impl = {
        initialized: false,

        /**
         * Fired after the main Boomerang beacon is sent
         *
         * @param {object} data Beacon Data
         */
        onBeacon: function(data) {
            // send the data to split sdk  after a short delay
            setTimeout(function() {
                var name, eventProps = {};

                for (name in data) {

                    // if `name` is first class property and we are tracking it in beaconParamsToCopy, then add it.
                    if (data.hasOwnProperty(name) && beaconParamToCopy.hasOwnProperty(name)) {
                        eventProps[name] = data[name];
                    }
                }


                //
                // Send to Split SDK
                //
                splitClient.track('TRAFFIC_TYPE', 'boomr_page_load', null, eventProps);
            }, 0);
        }
    };

    //
    // Exports
    //
    BOOMR.plugins.BeaconRepeater = {
        /**
         * Initializes the plugin.
         *
         * This plugin does not have any configuration.
         *
         * @returns {@link BOOMR.plugins.BeaconRepeater} The BeaconRepeater plugin for chaining
         * @memberof BOOMR.plugins.BeaconRepeater
         */
        init: function() {
            if (!impl.initialized) {
                BOOMR.subscribe("beacon", impl.onBeacon, null, impl);

                impl.initialized = true;
            }

            return this;
        },

        /**
         * Whether or not this plugin is complete
         *
         * @returns {boolean} `true` if the plugin is complete
         * @memberof BOOMR.plugins.BeaconRepeater
         */
        is_complete: function() {
            return true;
        }
    };
}());