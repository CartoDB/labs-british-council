'use strict';

(function () {
    window.bc = window.bc || {};

    window.bc.sql = new cartodb.SQL({
        user: 'dcarrion',
        protocol: "https",
        sql_api_template: "https://{user}.cartodb.com:443"
    });

    window.onload = function () {
        var bc = window.bc;

        // Change layer queries so that both layers are affected by all widgets, not only their own
        var updateLayers = function () {
            var sbus = bc.widgets["sbus"]._acceptedCategories().pluck("name");
            var partner_types = bc.widgets["partner_types"]._acceptedCategories().pluck("name");
            var countries = bc.widgets["countries"]._acceptedCategories().pluck("name");

            var activity_query = 'select * from activities';
            var partner_query = 'select distinct on (partner_name) * from activities';
            var where_clause = '';

            if (sbus.length > 0) {
                where_clause += " where activity_sbu in ('" + sbus.join("','") + "')";
            }
            if (partner_types.length > 0) {
                if (sbus.length > 0) {
                    where_clause += " and ";
                } else {
                    where_clause += " where ";
                }
                where_clause += " partner_type in ('" + partner_types.join("','") + "')";
            }
            if (countries.length > 0) {
                if (sbus.length > 0 || partner_types.length > 0) {
                    where_clause += " and ";
                } else {
                    where_clause += " where ";
                }
                where_clause += " audience_country_code in ('" + countries.join("','") + "')";
            }
            console.log("setting sql", partner_query + where_clause);
            setTimeout(function () {
                bc.layers['activities'].set('sql', activity_query + where_clause);
                bc.layers['partners'].set('sql', partner_query + where_clause);
            }, 500); //TODO: find out if there is a more elegant way to do this
        };

        cartodb.deepInsights.createDashboard('#dashboard', bc.viz, {
            no_cdn: false
        }, function (err, dashboard) {
            if (err) {
                console.log('There was an error generating the dashboard: ' + err);
                return;
            }

            bc.dashboard = dashboard;
            bc.map = bc.dashboard.getMap();
            bc.layers = {
                'regions': bc.map.getLayer(2),
                'constituencies': bc.map.getLayer(1),
                'activities': bc.map.getLayer(3),
                'partners': bc.map.getLayer(4)
            };
            bc.widgets = {
                 'partners': bc.dashboard.getWidget("c8e04c7f-cc06-43da-8e4f-d7b570218245"),
                 'partner_types': bc.dashboard.getWidget("013d6f4d-2824-4730-8aa8-fad59a079813"),
                 'countries': bc.dashboard.getWidget("794485ba-830f-4fc7-824b-e820f41f15ee"),
                 'sbus': bc.dashboard.getWidget("e2463ef2-2dee-4105-9740-f7cb118b13fd")
            }

            // Layer selector
            $('.Layer_selector a').click(function (e) {
                var layer_name = e.currentTarget.getAttribute('data-layer');
                console.log(layer_name, e);
                var is_visible = bc.layers[layer_name].get('visible');
                bc.layers[layer_name].set('visible', !is_visible);
                $(this).toggleClass('is_visible');
            });

            // Filter activities by all widgets, including those related to the partner layer
            bc.widgets['sbus']._acceptedCategories().on('add remove reset', updateLayers);
            bc.widgets['partner_types']._acceptedCategories().on('add remove reset', updateLayers);
            bc.widgets['countries']._acceptedCategories().on('add remove reset', updateLayers);
        });
    };
})();
