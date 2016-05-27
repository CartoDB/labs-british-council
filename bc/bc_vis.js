window.bc = window.bc || {};

window.bc.viz = {
    "analyses": [
        {
            "id": "a0",
            "options": {
                "table_name": "programmes_full"
            },
            "params": {
                "query": "SELECT * FROM programmes_full"
            },
            "type": "source"
        }
    ],
    "bounds": [
        [
            49.965356,
            -12.282715
        ],
        [
            59.601095,
            2.812500
        ]
    ],
    "center": "[53.49417330661025, -2.340087890625]",
    "datasource": {
        "maps_api_template": "https://{user}.cartodb.com:443",
        "stat_tag": "1a6ec0f4-16dc-11e6-a2c1-0e3ff518bd15",
        "user_name": "kevinsmith"
    },
    "description": null,
    "id": "1a6ec0f4-16dc-11e6-a2c1-0e3ff518bd15",
    "layers": [
        {
            "id": "4ee6c956-7c11-4658-b1b5-de3e92c10116",
            "infowindow": null,
            "options": {
                "attribution": "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"http://cartodb.com/attributions\">CartoDB</a>",
                "className": "httpsbasemapscartocdncomlight_nolabelszxypng",
                "default": "true",
                "id": "4ee6c956-7c11-4658-b1b5-de3e92c10116",
                "labels": {
                    "url": "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
                },
                "maxZoom": "18",
                "minZoom": "0",
                "name": "Positron",
                "order": 0,
                "subdomains": "abcd",
                "type": "Tiled",
                "url": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
                "urlTemplate": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
                "visible": true
            },
            "order": 0,
            "tooltip": null,
            "type": "tiled"
        },
        {
            "options": {
                "attribution": "",
                "filter": "mapnik",
                "layer_definition": {
                    "layers": [
                        {
                            "id": "0a4c41f9-e792-485a-930c-bc508a1e93fa",
                            "infowindow": {
                                "alternative_names": {},
                                "fields": [
                                    {
                                        "name": "cartodb_id",
                                        "position": 1,
                                        "title": true
                                    },
                                    {
                                        "name": "name",
                                        "position": 2,
                                        "title": true
                                    }
                                ],
                                "maxHeight": 180,
                                "template_type": "underscore",
                                "template_name": "table/views/infowindow_light",
                                "width": 226
                            },
                            "legend": {
                                "show_title": false,
                                "template": "",
                                "title": "",
                                "type": "none",
                                "visible": true
                            },
                            "options": {
                                "cartocss": "/** simple visualization */\n\n#westminster_constituencies{\n  polygon-fill: #f7ebdd;\n  polygon-opacity: 0;\n  line-color: #FA7806;\n  line-width: 0.25;\n  line-opacity: 0.5;\n}",
                                "cartocss_version": "2.1.1",
                                "interactivity": "cartodb_id",
                                "layer_name": "westminster_constituencies",
                                "sql": "select * from westminster_constituencies"
                            },
                            "order": 1,
                            "tooltip": {
                                "alternative_names": {},
                                "fields": [],
                                "maxHeight": 180,
                                "template": "<div class=\"CDB-Tooltip CDB-Tooltip--isLight\">\n  <ul class=\"CDB-Tooltip-list\">\n    {{#fields}}\n      <li class=\"CDB-Tooltip-listItem\">\n        {{#title}}\n          <h3 class=\"CDB-Tooltip-listTitle\">{{{ title }}}</h3>\n        {{/title}}\n        <h4 class=\"CDB-Tooltip-listText\">{{{ value }}}</h4>\n      </li>\n    {{/fields}}\n  </ul>\n</div>\n",
                                "template_name": "tooltip_light"
                            },
                            "type": "CartoDB",
                            "visible": true
                        },
                        {
                            "id": "a6879ec9-5418-42d6-a171-2f214dde8b77",
                            "infowindow": {
                                "alternative_names": {},
                                "fields": [
                                    {
                                        "name": "cartodb_id",
                                        "position": 1,
                                        "title": true
                                    },
                                    {
                                        "name": "name",
                                        "position": 2,
                                        "title": true
                                    }
                                ],
                                "maxHeight": 180,
                                "template_type": "underscore",
                                "template_name": "table/views/infowindow_light",
                                "width": 226
                            },
                            "legend": {
                                "show_title": false,
                                "template": "",
                                "title": "",
                                "type": "none",
                                "visible": true
                            },
                            "options": {
                                "cartocss": "/** simple visualization */\n\n#uk_administrative_regions{\n  ::line{\n line-color:#FA7806;\n line-width:0.5;\n}\n polygon-fill: #f7ebdd;\n  polygon-opacity: 0.6;\n  line-color: #D55923;\n image-filters: agg-stack-blur(2,2);\n  line-width: 0.5;\n  line-opacity: 0.8;\n}",
                                "cartocss_version": "2.1.1",
                                "interactivity": "cartodb_id",
                                "layer_name": "uk_administrative_regions",
                                "sql": "select * from uk_administrative_regions"
                            },
                            "order": 2,
                            "tooltip": {
                                "alternative_names": {},
                                "fields": [],
                                "maxHeight": 180,
                                "template": "<div class=\"CDB-Tooltip CDB-Tooltip--isLight\">\n  <ul class=\"CDB-Tooltip-list\">\n    {{#fields}}\n      <li class=\"CDB-Tooltip-listItem\">\n        {{#title}}\n          <h3 class=\"CDB-Tooltip-listTitle\">{{{ title }}}</h3>\n        {{/title}}\n        <h4 class=\"CDB-Tooltip-listText\">{{{ value }}}</h4>\n      </li>\n    {{/fields}}\n  </ul>\n</div>\n",
                                "template_name": "tooltip_light"
                            },
                            "type": "CartoDB",
                            "visible": true
                        },
                        {
                            "id": "7bd65c25-1227-410e-8b41-7d397b1479b1",
                            "infowindow": null,
                            "legend": {
                                "show_title": false,
                                "template": "",
                                "title": "",
                                "type": "none",
                                "visible": true
                            },
                            "options": {
                                "cartocss": "/** simple visualization */\n\n#programmes_full{\n  marker-fill-opacity: 0;\n  marker-line-color: #FFF;\n  marker-line-width: 0;\n  marker-line-opacity: 0;\n  marker-placement: point;\n  marker-type: ellipse;\n  marker-width: 0;\n  marker-fill: #4CD6B5;\n  marker-allow-overlap: true;\n}",
                                "cartocss_version": "2.1.1",
                                "interactivity": "cartodb_id",
                                "layer_name": "programmes_full",
                                "source": "a0"
                            },
                            "order": 3,
                            "tooltip": {
                                "alternative_names": {},
                                "fields": [],
                                "maxHeight": 180,
                                "template": "<div class=\"CDB-Tooltip CDB-Tooltip--isLight\">\n  <ul class=\"CDB-Tooltip-list\">\n    {{#fields}}\n      <li class=\"CDB-Tooltip-listItem\">\n        {{#title}}\n          <h3 class=\"CDB-Tooltip-listTitle\">{{{ title }}}</h3>\n        {{/title}}\n        <h4 class=\"CDB-Tooltip-listText\">{{{ value }}}</h4>\n      </li>\n    {{/fields}}\n  </ul>\n</div>\n",
                                "template_name": "tooltip_light"
                            },
                            "type": "CartoDB",
                            "visible": true
                        },
                        {
                            "id": "54c4e03d-88af-4b7b-a475-1d49d99839d8",
                            "infowindow": {
                                "alternative_names": {},
                                "fields": [
                                    {
                                        "name": "partner",
                                        "position": 0,
                                        "title": true
                                    },
                                    {
                                        "name": "post_code",
                                        "position": 6,
                                        "title": true
                                    },
                                    {
                                        "name": "partner_type",
                                        "position": 7,
                                        "title": true
                                    },
                                    {
                                        "name": "governmentregion",
                                        "position": 8,
                                        "title": true
                                    }
                                ],
                                "maxHeight": 180,
                                "template_type": "mustache",
                                "template": "<div class=\"CDB-infowindow CDB-infowindow--light js-infowindow\">\n  <div class=\"CDB-infowindow-container\">\n    {{#loading}}\n            <div class=\"CDB-Loader js-loader is-visible\"></div>\n          {{/loading}}\n <div class=\"CDB-infowindow-bg\">\n      <div class=\"CDB-infowindow-inner\">\n  <div class=\"CDB-infowindow-close close\">\n X </div>\n       <ul class=\"CDB-infowindow-list js-content\">\n                   {{#content.fields}}\n          <li class=\"CDB-infowindow-listItem\">\n            {{#title}}<h5 class=\"CDB-infowindow-subtitle\">{{title}}</h5>{{/title}}\n            {{#value}}<h4 class=\"CDB-infowindow-title\">{{{ value }}}</h4>{{/value}}\n            {{^value}}<h4 class=\"CDB-infowindow-title\">null</h4>{{/value}}\n          </li>\n          {{/content.fields}}\n        </ul>\n      </div>\n    </div>\n    <div class=\"CDB-hook\">\n      <div class=\"CDB-hook-inner\"></div>\n    </div>\n  </div>\n</div>\n",
                                "template_name": "table/views/infowindow_light",
                                "width": 226
                            },
                            "legend": {
                                "show_title": false,
                                "template": "",
                                "title": "",
                                "type": "none",
                                "visible": true
                            },
                            "options": {
                                "cartocss": "/** simple visualization */\n\n#partners{\n  marker-fill-opacity: 0.8;\n  marker-line-color:#377787;\n  marker-line-width: 1;\n  marker-line-opacity: 1;\n  marker-placement: point;\n  marker-type: ellipse;\n  marker-width: 7;\n  marker-fill:#4CD6B5;\n  marker-allow-overlap: true;\n [zoom<=8]{marker-width:5;\n marker-line-width:0.5;\n}\n}",
                                "cartocss_version": "2.1.1",
                                "interactivity": "cartodb_id",
                                "layer_name": "partners",
                                "sql": "select distinct on (partner) * from programmes_full"
                            },
                            "order": 4,
                            "tooltip": {
                                "alternative_names": {},
                                "fields": [],
                                "maxHeight": 180,
                                "template": "<div class=\"CDB-Tooltip CDB-Tooltip--isLight\">\n  <ul class=\"CDB-Tooltip-list\">\n    {{#fields}}\n      <li class=\"CDB-Tooltip-listItem\">\n        {{#title}}\n          <h3 class=\"CDB-Tooltip-listTitle\">{{{ title }}}</h3>\n        {{/title}}\n        <h4 class=\"CDB-Tooltip-listText\">{{{ value }}}</h4>\n      </li>\n    {{/fields}}\n  </ul>\n</div>\n",
                                "template_name": "tooltip_light"
                            },
                            "type": "CartoDB",
                            "visible": true
                        }
                    ],
                    "stat_tag": "1a6ec0f4-16dc-11e6-a2c1-0e3ff518bd15",
                    "version": "3.0.0"
                },
                "maps_api_template": "https://{user}.cartodb.com:443",
                "sql_api_template": "https://{user}.cartodb.com:443",
                "user_name": "kevinsmith"
            },
            "type": "layergroup"
        },
        {
            "id": "cc5a19c4-df84-4c3c-b40f-8ed6ca179e86",
            "infowindow": null,
            "options": {
                "attribution": "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"http://cartodb.com/attributions\">CartoDB</a>",
                "className": "httpsbasemapscartocdncomlight_only_labelszxypng",
                "default": "true",
                "id": "cc5a19c4-df84-4c3c-b40f-8ed6ca179e86",
                "maxZoom": "18",
                "minZoom": "0",
                "name": "Positron Labels",
                "order": 5,
                "subdomains": "abcd",
                "type": "Tiled",
                "url": "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
                "urlTemplate": "http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
                "visible": true
            },
            "order": 5,
            "tooltip": null,
            "type": "tiled"
        }
    ],
    "legends": true,
    "likes": 0,
    "map_provider": "leaflet",
    "next": null,
    "overlays": [
        {
            "options": {
                "display": true,
                "x": 20,
                "y": 20
            },
            "order": 2,
            "template": "",
            "type": "share"
        },
        {
            "options": {
                "display": true,
                "x": 60,
                "y": 20
            },
            "order": 3,
            "template": "",
            "type": "search"
        },
        {
            "options": {
                "display": true,
                "x": 20,
                "y": 20
            },
            "order": 6,
            "template": "<a href=\"#zoom_in\" class=\"zoom_in\">+</a> <a href=\"#zoom_out\" class=\"zoom_out\">-</a>",
            "type": "zoom"
        },
        {
            "options": {
                "display": true,
                "x": 20,
                "y": 150
            },
            "order": 8,
            "template": "<div class=\"loader\" original-title=\"\"></div>",
            "type": "loader"
        },
        {
            "options": {
                "display": true,
                "x": 10,
                "y": 40
            },
            "order": 9,
            "template": "",
            "type": "logo"
        }
    ],
    "prev": null,
    "scrollwheel": false,
    "title": "Activity Map",
    "transition_options": {
        "time": 0
    },
    "updated_at": "2016-05-12T08:13:29+00:00",
    "user": {
        "avatar_url": "//gravatar.com/avatar/61ef76b031d0b335889a705ddd1b8d59?s=128",
        "fullname": "British Council"
    },
    "vector": false,
    "version": "3.0.0",
    "widgets": [
        {
            "id": "c8e04c7f-cc06-43da-8e4f-d7b570218245",
            "layer_id": "54c4e03d-88af-4b7b-a475-1d49d99839d8",
            "options": {
                "column": "cartodb_id",
                "operation": "count",
                "prefix": "",
                "schema": {},
                "suffix": "",
                "sync_on_bbox_change": true,
                "sync_on_data_change": true
            },
            "order": 1,
            "source": {
                "id": "a0"
            },
            "title": "Number of partners",
            "type": "formula"
        },
        {
            "id": "794485ba-830f-4fc7-824b-e820f41f15ee",
            "layer_id": "7bd65c25-1227-410e-8b41-7d397b1479b1",
            "options": {
                "aggregation": "count",
                "aggregation_column": "country",
                "column": "country",
                "sync_on_bbox_change": true,
                "sync_on_data_change": true
            },
            "order": 2,
            "source": {
                "id": "a0"
            },
            "title": "Partner Country",
            "type": "category"
        },
        {
            "id": "e2463ef2-2dee-4105-9740-f7cb118b13fd",
            "layer_id": "7bd65c25-1227-410e-8b41-7d397b1479b1",
            "options": {
                "aggregation": "count",
                "aggregation_column": "sbu",
                "column": "sbu",
                "sync_on_bbox_change": true,
                "sync_on_data_change": true
            },
            "order": 3,
            "source": {
                "id": "a0"
            },
            "title": "Strategic Business Unit",
            "type": "category"
        },
        {
            "id": "013d6f4d-2824-4730-8aa8-fad59a079813",
            "layer_id": "54c4e03d-88af-4b7b-a475-1d49d99839d8",
            "options": {
                "aggregation": "count",
                "aggregation_column": "partner_type",
                "column": "partner_type",
                "sync_on_bbox_change": true,
                "sync_on_data_change": true
            },
            "order": 4,
            "source": {
                "id": "a0"
            },
            "title": "Partner type",
            "type": "category"
        }
    ],
    "zoom": 7
}
