/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';

import NavbarControls from './EC5Location-components/NavbarControls';

import { showToastError, showToastSuccess } from '../../actions/toast';
import config from '../../constants/config';
import parameters from '../../constants/parameters';
import strings from '../../constants/strings';

const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

const L = window.L;

class EC5Location extends Component {

    constructor(props) {
        super(props);

        this.state = {
            latitude: isNumeric(this.props.answer.latitude) ? this.props.answer.latitude : '',
            longitude: isNumeric(this.props.answer.longitude) ? this.props.answer.longitude : '',
            accuracy: this.props.answer.accuracy || parameters.LOCATION_ACCURACY,
            address: '',
            showOverlay: false
        };

        this.marker = {};
        this.map = {};
        this.zoom = 1;
        this.closeUpZoom = 10;//zoom level when we have a marker set
        this.errorZoom = 5;

        this.handleChangeLatitude = this.handleChangeLatitude.bind(this);
        this.handleChangeLongitude = this.handleChangeLongitude.bind(this);
        this.handleUpdateLocation = this.handleUpdateLocation.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this);
        this.handleSearchAddress = this.handleSearchAddress.bind(this);
        this.handleLocationError = this.handleLocationError.bind(this);
        this.handleLocateMe = this.handleLocateMe.bind(this);
    }

    componentDidMount () {

        const _locateMe = this.handleLocateMe;

        //build locate me control
        L.Control.Locate = L.Control.extend({
            onAdd () {
                const btn = L.DomUtil.create('a', 'leaflet-control-locate-me leaflet-bar');

                L.DomEvent.on(btn, 'click', (ev) => {
                    L.DomEvent.stopPropagation(ev);
                    _locateMe();
                });

                return btn;
            },
            onRemove () {
                // Nothing to do here
            }
        });

        //add locate me callback
        L.control.Locate = (opts) => {
            return new L.Control.Locate(opts);
        };


        this.map = L.map(this.mapNode).setView([0, 0], this.zoom);

        //add locate me control to map
        L.control.Locate({ position: 'topleft' }).addTo(this.map);

        //add tiles (CARTO) -> default
        const carto = L.tileLayer(config.CARTO_LIGHT_TILES_PROVIDER, {
            attribution: config.CARTO_TILES_ATTRIBUTION,
            maxNativeZoom: 20
        });

        const mapboxSatellite = L.tileLayer(config.MAPBOX_TILES_PROVIDER_SATELLITE, {
            attribution: config.MAPBOX_TILES_ATTRIBUTION,
            maxNativeZoom: 20
        });


        const stamenHC = L.tileLayer(config.STAMEN_HIGH_CONTRAST_TILES_PROVIDER, {
            attribution: config.STAMEN_TILES_ATTRIBUTION,
            maxNativeZoom: 20
        });

        //add tiles (MAPBOX OUTDOOR)
        const mapboxOutdoors = L.tileLayer(config.MAPBOX_OUTDOORS_TILES_PROVIDER, {
            attribution: config.MAPBOX_TILES_ATTRIBUTION,
            maxNativeZoom: 20
        });

        //add tiles (OSM)
        const osm = L.tileLayer(config.OSM_TILES_PROVIDER, {
            attribution: config.OSM_TILES_ATTRIBUTION,
            maxNativeZoom: 20
        });

        // layers control https://goo.gl/TNMUoJ
        carto.addTo(this.map); // to set it as the default
        const baseMaps = {
            Satellite: mapboxSatellite,
            Terrain: mapboxOutdoors,
            Contrast: stamenHC,
            Carto: carto,
            OpenStreetMap: osm
        };

        //add layers control
        L.control.layers(baseMaps).addTo(this.map);

        // If there is already a non empty answer
        this.setUp(this.state.latitude, this.state.longitude, parameters.LOCATION_ACCURACY);
    }

    setUp (latitude, longitude, accuracy, setState = false) {

        this.marker = L.marker([latitude, longitude], {
            draggable: true
        });

        // Update state
        if (setState) {
            this.setState({
                latitude: parseFloat(latitude.toFixed(6)),
                longitude: parseFloat(longitude.toFixed(6)),
                accuracy: parseFloat(accuracy)
            }, () => {
                this.map.setView([this.state.latitude, this.state.longitude], this.zoom);
                this.props.onInputChange({
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    accuracy: this.state.accuracy
                });
            });
        } else {

            //if lat and long are defined, show marker there
            if (isNumeric(latitude) && isNumeric(longitude)) {
                this.marker.addTo(this.map);
                this.map.setView([this.state.latitude, this.state.longitude], this.closeUpZoom);
            }
        }

        // Update marker on changing it's position
        this.marker.on('dragend', (e) => {
            const coords = e.target._latlng;

            this.setState({
                latitude: parseFloat(coords.lat.toFixed(6)),
                longitude: parseFloat(coords.lng.toFixed(6)),
                accuracy: parameters.LOCATION_ACCURACY
            }, () => {
                this.map.setView([this.state.latitude, this.state.longitude], this.map.getZoom());
                this.props.onInputChange({
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    accuracy: this.state.accuracy
                });
            });
        });

    }

    hideOverlay () {
        window.setTimeout(() => {
            this.setState({
                showOverlay: false
            });
        }, 500);
    }

    handleLocationError () {

        /* geolocation IS NOT available */
        this.props.showToastError(strings.location_not_available);

        this.marker = L.marker([this.state.latitude, this.state.longitude], {
            draggable: true
        }).addTo(this.map);
        this.map.setView([this.state.latitude, this.state.longitude], this.errorZoom);

        // Update marker on changing it's position
        this.marker.on('dragend', (e) => {
            const coords = e.target._latlng;

            this.setState({
                latitude: parseFloat(coords.lat.toFixed(6)),
                longitude: parseFloat(coords.lng.toFixed(6)),
                accuracy: parameters.LOCATION_ACCURACY
            }, () => {
                this.map.setView([this.state.latitude, this.state.longitude], this.map.getZoom());
                this.props.onInputChange({
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    accuracy: this.state.accuracy
                });
            });
        });
    }

    handleChangeLatitude (event) {
        this.setState({
            // Use Number() to avoid string returns https://goo.gl/7fyCgp
            // Check not null/empty/undefined. If so, always set empty string
            latitude: event.target.value ? Number(parseFloat(event.target.value).toFixed(6)) : ''
        }, () => {
            this.props.onInputChange({
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                // If we have empty lat and lon, clear accuracy
                accuracy: !this.state.latitude && !this.state.longitude ? '' : this.state.accuracy
            });
        });
    }

    handleChangeLongitude (event) {
        this.setState({
            // Use Number() to avoid string returns https://goo.gl/7fyCgp
            // Check not null/empty/undefined. If so, always set empty string
            longitude: event.target.value ? Number(parseFloat(event.target.value).toFixed(6)) : ''
        }, () => {
            this.props.onInputChange({
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                // If we have empty lat and lon, clear accuracy
                accuracy: !this.state.latitude && !this.state.longitude ? '' : this.state.accuracy
            });
        });

    }

    handleUpdateLocation () {

        const currentLatLong = this.marker.getLatLng();
        const parsedLat = parseFloat(currentLatLong.lat.toFixed(6));
        const parsedLong = parseFloat(currentLatLong.lng.toFixed(6));


        // check coords are numbers
        if (!isNumeric(this.state.latitude) || !isNumeric(this.state.longitude)) {
            this.props.showToastError(strings.invalid_coords);
            return;
        }

        // check coord are in valid range
        if (this.state.latitude < -90 || this.state.latitude > 90 || this.state.longitude < -180 || this.state.longitude > 180) {
            this.props.showToastError(strings.invalid_coords);
            return;
        }

        if (parsedLat === this.state.latitude && parsedLong === this.state.longitude) {
            this.props.showToastSuccess(strings.location_updated);
            this.hideOverlay();
            return;
        }

        this.setState({
            showOverlay: true
        }, () => {
            this.marker.setLatLng(new L.LatLng(this.state.latitude, this.state.longitude));
            this.map.setView([this.state.latitude, this.state.longitude], this.closeUpZoom);
            this.props.showToastSuccess(strings.location_updated);
            this.marker.addTo(this.map);//check if it is adding it twice, it seems it is ok
            this.hideOverlay();
        });


    }

    handleChangeAddress (event) {
        this.setState({
            address: event.target.value
        });
    }

    handleSearchAddress () {

        const server = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_SERVER_URL : process.env.DEVELOPMENT_SERVER_URL;
        this.setState({
            showOverlay: true
        });
        //opencage is accessed via a proxy
        fetch(server + window.EC5_LIBRARIES.PARAMETERS.API.ROUTES.OPENCAGE + this.state.address)
            .then((response) => {
                return response.json();
            }).then((json) => {
                //see api here https://geocoder.opencagedata.com/api#forward-resp
                if (json.status.code === 200 && json.results.length > 0) {
                    this.setState({
                        longitude: parseFloat(json.results[0].geometry.lng.toFixed(6)),
                        latitude: parseFloat(json.results[0].geometry.lat.toFixed(6)),
                        accuracy: parameters.LOCATION_ACCURACY
                    }, () => {
                        this.handleUpdateLocation();
                        this.props.onInputChange({
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            accuracy: this.state.accuracy
                        });
                    });
                } else {
                    this.props.showToastError(strings.no_location_found);
                    this.hideOverlay();
                }
            }).catch(() => {
                this.props.showToastError(strings.no_location_found);
                this.hideOverlay();
            });

    }

    handleLocateMe () {

        if ('geolocation' in navigator) {

            this.setState({
                showOverlay: true
            });

            /* geolocation is available */
            navigator.geolocation.getCurrentPosition((position) => {
                // Add current location to state
                this.setState({
                    longitude: parseFloat(position.coords.longitude.toFixed(6)),
                    latitude: parseFloat(position.coords.latitude.toFixed(6)),
                    accuracy: position.coords.accuracy
                }, () => {
                    this.handleUpdateLocation();
                    this.props.onInputChange({
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        accuracy: this.state.accuracy
                    });
                });

            }, () => {
                this.props.showToastError(strings.location_not_available);
                this.hideOverlay();
            });
        } else {
            this.props.showToastError(strings.location_not_available);
            this.hideOverlay();
        }

    }

    render () {
        return (
            <div className="ec5-location">
                <div
                    className={this.state.showOverlay ? 'overlay' : 'overlay hidden'}
                >
                    <span>Getting location, please wait...</span>
                </div>
                <NavbarControls
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    address={this.state.address}
                    handleChangeLatitude={this.handleChangeLatitude}
                    handleChangeLongitude={this.handleChangeLongitude}
                    handleUpdateLocation={this.handleUpdateLocation}
                    handleSearchAddress={this.handleSearchAddress}
                    handleChangeAddress={this.handleChangeAddress}
                />

                <div
                    id="map"
                    ref={(mapNode) => {
                        this.mapNode = mapNode;
                    }}
                />

            </div>
        );
    }
}

function mapStateToProps (state) {

    const { projectReducer, formReducer } = state;
    const { project } = projectReducer;
    const { formRef } = formReducer;
    return {
        project,
        formRef
    };

}

EC5Location.propTypes = {
    answer: React.PropTypes.object,
    onInputChange: React.PropTypes.func,
    showToastError: React.PropTypes.func,
    showToastSuccess: React.PropTypes.func,
    statusCodes: React.PropTypes.object
};

export default connect(mapStateToProps, { showToastError, showToastSuccess })(EC5Location);
