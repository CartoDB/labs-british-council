'use strict';

(function () {
    window.bc = window.bc || {};

    window.bc.sql = new cartodb.SQL({
        user: 'dcarrion',
        protocol: "https",
        sql_api_template: "https://{user}.cartodb.com:443"
    });

    window.bc.sql_geojson = new cartodb.SQL({
        user: 'dcarrion',
        protocol: "https",
        sql_api_template: "https://{user}.cartodb.com:443",
        format: "geojson"
    });

    window.onload = function () {
        var bc = window.bc;

        // Find new layer queries so that both layers are affected by all widgets, not only their own
        var updateLayerQueries = function () {
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

            return {
                activity_query: activity_query + where_clause,
                partner_query: partner_query + where_clause,
                where_clause: where_clause
            }
        }

        // Change layer queries so that both layers are affected by all widgets, not only their own
        var updateLayers = function () {
            var queries = updateLayerQueries();
            setTimeout(function () {
                bc.layers['activities'].set('sql', queries['activity_query']);
                bc.layers['partners'].set('sql', queries['partner_query']);
            }, 500); //TODO: find out if there is a more elegant way to do this
        };

        var showFeature = function (cartodb_id) {
            bc.sql_geojson.execute("select ST_Simplify(the_geom, 0.1) as the_geom from uk_administrative_regions where cartodb_id = " + cartodb_id)
                .done(function(geojson) {
                    if (bc.polygon) {
                        bc.map.removeLayer(polygon);
                    }
                    bc.polygon = L.geoJson(geojson, {
                        style: {
                            color: "#000",
                            fillColor: "#fff",
                            weight: 2,
                            opacity: 0.65
                        }
                    }).addTo(bc.map.map);
                });
        }

        var centerOnFeature = function (cartodb_id, table) {
            bc.sql.execute("with center as (select st_centroid(the_geom) as the_geom from " + table + " where cartodb_id = " + cartodb_id + ") select st_x(the_geom) as lon, st_y(the_geom) as lat from center")
                .done(function (data) {
                    var lonlat = data.rows[0];
                    var queries = updateLayerQueries();

                    bc.map.map.setView(lonlat, bc.map.map.getZoom());
                    bc.sql.execute("select count(*) from activities, " + table + " " + (queries['where_clause'] ? queries['where_clause'] + " and " : "where ") + table + ".cartodb_id = " + cartodb_id + " and st_intersects(activities.the_geom, " + table + ".the_geom)")
                        .done(function (activity_count) {
                            bc.sql.execute("with partners as (select distinct on (partner_name) * from activities " + queries['where_clause'] + ") select count(*) from partners, " + table + " where " + table + ".cartodb_id = " + cartodb_id + " and st_intersects(partners.the_geom, " + table + ".the_geom)")
                                .done(function (partner_count) {
                                    alert("Number of partners: " + partner_count.rows[0].count + "\nNumber of activities: " + activity_count.rows[0].count);
                                });
                        });
                    bc.layers[table].trigger('featureClick', null, [lonlat.lat, lonlat.lon], null, {cartodb_id: cartodb_id}, 0);
                });
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
                'uk_administrative_regions': bc.map.getLayer(2),
                'westminster_constituencies': bc.map.getLayer(1),
                'activities': bc.map.getLayer(3),
                'partners': bc.map.getLayer(4)
            };
            bc.widgets = {
                'partners': bc.dashboard.getWidget("c8e04c7f-cc06-43da-8e4f-d7b570218245"),
                'partner_types': bc.dashboard.getWidget("013d6f4d-2824-4730-8aa8-fad59a079813"),
                'countries': bc.dashboard.getWidget("794485ba-830f-4fc7-824b-e820f41f15ee"),
                'sbus': bc.dashboard.getWidget("e2463ef2-2dee-4105-9740-f7cb118b13fd")
            }

            bc.layers["westminster_constituencies"].on('featureClick', function(e, latlng, pos, data, subLayerIndex) {
                console.log("mouse over polygon with data:", e, latlng, pos, data, subLayerIndex);
            });
            bc.layers["uk_administrative_regions"].on('featureClick', function(e, latlng, pos, data, subLayerIndex) {
                console.log("mouse over polygon with data:", e, latlng, pos, data, subLayerIndex);
            });
            // Layer selector
            $('.Layer_selector a').click(function (e) {
                var layer_name = e.currentTarget.getAttribute('data-layer');
                var is_visible = bc.layers[layer_name].get('visible');
                bc.layers[layer_name].set('visible', !is_visible);
                $(this).toggleClass('is_visible');
                console.log(".region-locator-" + layer_name.replace("_", "-"));
                $(".region-locator-" + layer_name.replace(/_/g, "-")).toggle();
            });

            // Filter activities by all widgets, including those related to the partner layer
            bc.widgets['sbus']._acceptedCategories().on('add remove reset', updateLayers);
            bc.widgets['partner_types']._acceptedCategories().on('add remove reset', updateLayers);
            bc.widgets['countries']._acceptedCategories().on('add remove reset', updateLayers);

            // Adm. regions locator
            bc.sql.execute("select cartodb_id as id, name as text from uk_administrative_regions")
                .done(function (data) {
                    bc.uk_administrative_regions = data.rows;
                    bc.adm_region_select = $('.region-locator-uk-administrative-regions select').select2({
                        data: bc.uk_administrative_regions
                    });
                    bc.adm_region_select.on("select2:select", function (e) {
                        //bc.layers["uk_administrative_regions"].on('featureClick', function (e, pos, latlng, data) {
                        centerOnFeature(e.params.data.id, "uk_administrative_regions");
                        //});
                    });
                });

            // Constituencies locator
            bc.sql.execute("select cartodb_id as id, name as text from westminster_constituencies")
                .done(function (data) {
                    bc.westminster_constituencies = data.rows;
                    bc.westminster_constituencies_select = $('.region-locator-westminster-constituencies select').select2({
                        data: bc.westminster_constituencies
                    });
                    bc.westminster_constituencies_select.on("select2:select", function (e) {
                        centerOnFeature(e.params.data.id, "westminster_constituencies");
                    });
                });
        });
    };
})();
