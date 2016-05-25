'use strict';

(function () {
    window.bc = window.bc || {};

    window.bc.sql = new cartodb.SQL({
        user: 'kevinsmith',
        protocol: "https",
        sql_api_template: "https://{user}.cartodb.com:443"
    });

    window.bc.sql_geojson = new cartodb.SQL({
        user: 'kevinsmith',
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

            var programme_query = 'select * from programmes_full';
            var partner_query = 'select distinct on (partner) * from programmes_full';
            var where_clause = '';

            if (sbus.length > 0) {
                where_clause += " where sbu in ('" + sbus.join("','") + "')";
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
                where_clause += " country in ('" + countries.join("','") + "')";
            }

            return {
                programme_query: programme_query + where_clause,
                partner_query: partner_query + where_clause,
                where_clause: where_clause
            }
        }

        // Change layer queries so that both layers are affected by all widgets, not only their own
        var updateLayers = function () {
            var queries = updateLayerQueries();
            setTimeout(function () {
                bc.layers['programmes'].set('sql', queries['programme_query']);
                bc.layers['partners'].set('sql', queries['partner_query']);
            }, 500); //TODO: find out if there is a more elegant way to do this
        };

        var highlightFeature = function (cartodb_id, table) {
            bc.sql_geojson.execute("select the_geom from " + table + " where cartodb_id = " + cartodb_id)
                .done(function(geojson) {
                    if (bc.polygon) {
                        bc.native_map.removeLayer(bc.polygon);
                    }
                    bc.polygon = L.geoJson(geojson, {
                        style: {
                            color: "#FF6F00",
                            fillColor: "#fff",
                            weight: 2,
                            opacity: 0.65
                        }
                    }).addTo(bc.native_map);
                });
        }

        var getUKAdministrativeRegionCounters = function (cartodb_id, callback) {
            var queries = updateLayerQueries();

            bc.sql.execute("select count(*) from programmes_full, uk_administrative_regions " + (queries['where_clause'] ? queries['where_clause'] + " and " : "where ") + "uk_administrative_regions.cartodb_id = " + cartodb_id + " and st_intersects(programmes_full.the_geom, uk_administrative_regions.the_geom)")
                .done(function (programme_count) {
                    bc.sql.execute("with partners as (select distinct on (partner) * from programmes_full " + queries['where_clause'] + ") select count(*) from partners, uk_administrative_regions where uk_administrative_regions.cartodb_id = " + cartodb_id + " and st_intersects(partners.the_geom, uk_administrative_regions.the_geom)")
                        .done(function (partner_count) {
                            callback({partner_count: partner_count.rows[0].count, programme_count: programme_count.rows[0].count});
                        });
                });
        };

        var getWestminsterConstituencyCounters = function (cartodb_id, callback) {
            var queries = updateLayerQueries();

            // TODO: intersection + area calculation is a hack until we have a real foreign key between regions and constituencies
            bc.sql.execute("select uk_administrative_regions.cartodb_id, uk_administrative_regions.name, st_area(st_intersection(uk_administrative_regions.the_geom, westminster_constituencies.the_geom)) as area from uk_administrative_regions, westminster_constituencies where westminster_constituencies.cartodb_id = " + cartodb_id + " order by area desc limit 1")
                .done(function (region_data) {
                    var region = region_data.rows[0];

                    bc.sql.execute("select count(*) from programmes_full, uk_administrative_regions " + (queries['where_clause'] ? queries['where_clause'] + " and " : "where ") + "uk_administrative_regions.cartodb_id = " + region.cartodb_id + " and st_intersects(programmes_full.the_geom, uk_administrative_regions.the_geom)")
                        .done(function (programme_count) {
                            bc.sql.execute("with partners as (select distinct on (partner) * from programmes_full " + queries['where_clause'] + ") select count(*) from partners, uk_administrative_regions where uk_administrative_regions.cartodb_id = " + region.cartodb_id + " and st_intersects(partners.the_geom, uk_administrative_regions.the_geom)")
                                .done(function (partner_count) {
                                    bc.sql.execute("select distinct partner from programmes_full, westminster_constituencies " + (queries['where_clause'] ? queries['where_clause'] + " and " : "where ") + "westminster_constituencies.cartodb_id = " + cartodb_id + " and st_intersects(programmes_full.the_geom, westminster_constituencies.the_geom)")
                                        .done(function (partners) {
                                            bc.sql.execute("select distinct programme from programmes_full, westminster_constituencies " + (queries['where_clause'] ? queries['where_clause'] + " and " : "where ") + "westminster_constituencies.cartodb_id = " + cartodb_id + " and st_intersects(programmes_full.the_geom, westminster_constituencies.the_geom)")
                                                .done(function (programmes) {
                                                    bc.sql.execute("select distinct country from programmes_full, westminster_constituencies " + (queries['where_clause'] ? queries['where_clause'] + " and " : "where ") + "westminster_constituencies.cartodb_id = " + cartodb_id + " and st_intersects(programmes_full.the_geom, westminster_constituencies.the_geom)")
                                                        .done(function (countries) {
                                                            callback({
                                                                region_name: region.name,
                                                                region_partner_count: partner_count.rows[0].count,
                                                                region_programme_count: programme_count.rows[0].count,
                                                                partners: _.pluck(partners.rows, "partner").join(),
                                                                programmes: _.pluck(programmes.rows, "programme").join(),
                                                                countries: _.pluck(countries.rows, "country").join()
                                                            });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        };

        var centerOnFeature = function (cartodb_id, table) {
            highlightFeature(cartodb_id, table);

            bc.sql.execute("with center as (select st_centroid(the_geom) as the_geom from " + table + " where cartodb_id = " + cartodb_id + ") select st_x(the_geom) as lon, st_y(the_geom) as lat from center")
                .done(function (data) {
                    var lonlat = data.rows[0];

                    bc.native_map.setView(lonlat, bc.native_map.getZoom());
                    bc.layer_views[table].trigger('featureClick', null, [lonlat.lat, lonlat.lon], null, {cartodb_id: cartodb_id}, 1);
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
            bc.native_map = bc.map.getNativeMap();
            bc.layers = {
                'uk_administrative_regions': bc.map.getLayer(2),
                'westminster_constituencies': bc.map.getLayer(1),
                'programmes': bc.map.getLayer(3),
                'partners': bc.map.getLayer(4)
            };
            bc.layer_views = {
                'uk_administrative_regions': bc.map.getLayerViews()[2],
                'westminster_constituencies': bc.map.getLayerViews()[1],
            };
            bc.widgets = {
                'partners': bc.dashboard.getWidget("c8e04c7f-cc06-43da-8e4f-d7b570218245"),
                'partner_types': bc.dashboard.getWidget("013d6f4d-2824-4730-8aa8-fad59a079813"),
                'countries': bc.dashboard.getWidget("794485ba-830f-4fc7-824b-e820f41f15ee"),
                'sbus': bc.dashboard.getWidget("e2463ef2-2dee-4105-9740-f7cb118b13fd")
            }

            bc.layers["uk_administrative_regions"].infowindow.set({template: $('#infowindow_template_uk_administrative_regions').html()});
            bc.getInfowindowContentUKAdministrativeRegion = function (cartodb_id, region_name) {
                if (cartodb_id) {
                    highlightFeature(cartodb_id, "uk_administrative_regions");
                    getUKAdministrativeRegionCounters(cartodb_id, function (counters) {
                        $(".infowindow-uk-administrative-regions #region_name").text(region_name);
                        $(".infowindow-uk-administrative-regions #partner_count").text(counters.partner_count);
                        $(".infowindow-uk-administrative-regions #programme_count").text(counters.programme_count);
                        $(".CDB-Loader").removeClass("is-visible");
                    });
                }
            };

            bc.layers["westminster_constituencies"].infowindow.set({template: $('#infowindow_template_westminster_constituencies').html()});
            bc.getInfowindowContentWestminsterConstituency = function (cartodb_id, constituency_name) {
                if (cartodb_id) {
                    highlightFeature(cartodb_id, "westminster_constituencies");
                    getWestminsterConstituencyCounters(cartodb_id, function (counters) {
                        $(".infowindow-westminster-constituencies #region_name").text(counters.region_name);
                        $(".infowindow-westminster-constituencies #region_partner_count").text(counters.region_partner_count);
                        $(".infowindow-westminster-constituencies #region_programme_count").text(counters.region_programme_count);
                        $(".infowindow-westminster-constituencies #constituency_name").text(constituency_name);
                        $(".infowindow-westminster-constituencies #partners").text(counters.partners);
                        $(".infowindow-westminster-constituencies #programmes").text(counters.programmes);
                        $(".infowindow-westminster-constituencies #countries").text(counters.countries);
                        $(".CDB-Loader").removeClass("is-visible");
                    });
                }
            };

            // Layer selector
            $('.Layer_selector a').click(function (e) {
                var layer_name = e.currentTarget.getAttribute('data-layer');
                var is_visible = bc.layers[layer_name].get('visible');
                bc.layers[layer_name].set('visible', !is_visible);
                $(this).toggleClass('is_visible');
                $(".region-locator-" + layer_name.replace(/_/g, "-")).toggle();
            });

            // Filter programmes by all widgets, including those related to the partner layer
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
                        centerOnFeature(e.params.data.id, "uk_administrative_regions");
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
