import React from 'react';
import HelpPopup from './HelpPopup';

const NavbarControls = (props) => {
    return (
        <div id="navbar-controls">
            <div className="row navbar-controls__latlong">
                <div className="form-group form-inline col-md-4 col-sm-4">
                    <label htmlFor="latitude">Latitude</label>
                    <input
                        type="number"
                        step="0.000001"
                        value={props.latitude}
                        onChange={props.handleChangeLatitude}
                        className="form-control navbar-controls__latitude"
                        placeholder="Not yet set"
                    />
                </div>

                <div className="form-group form-inline col-md-4 col-sm-4">
                    <label htmlFor="longitude">Longitude</label>
                    <input
                        type="number"
                        step="0.000001"
                        value={props.longitude}
                        onChange={props.handleChangeLongitude}
                        className="form-control navbar-controls__longitude"
                        placeholder="Not yet set"
                    />
                </div>

                <div className="form-group form-inline col-md-4 col-sm-4">
                    <button
                        className="update btn btn-action btn-update-location btn-sm"
                        onClick={props.handleUpdateLocation}
                    >
                        Update Location
                    </button>
                </div>

            </div>


            <div className="row navbar-controls__search">

                <div className="form-group form-inline col-md-8 col-sm-8">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        value={props.address}
                        onChange={props.handleChangeAddress}
                        className="form-control address"
                        placeholder="i.e. London"
                    />
                </div>
                <div className="form-group form-inline col-md-4 col-sm-4">
                    <button
                        className="btn btn-action btn-search-address btn-sm"
                        onClick={props.handleSearchAddress}
                    >
                        Search
                    </button>
                    <HelpPopup />
                </div>

            </div>

        </div>
    );
};

NavbarControls.propTypes = {
    handleChangeLatitude: React.PropTypes.func.isRequired,
    latitude: React.PropTypes.oneOfType([
        React.PropTypes.string.isRequired,
        React.PropTypes.number.isRequired
    ]),
    longitude: React.PropTypes.oneOfType([
        React.PropTypes.string.isRequired,
        React.PropTypes.number.isRequired
    ]),
    handleChangeLongitude: React.PropTypes.func.isRequired,
    handleSearchAddress: React.PropTypes.func.isRequired,
    handleChangeAddress: React.PropTypes.func.isRequired,
    handleUpdateLocation: React.PropTypes.func.isRequired,
    address: React.PropTypes.string.isRequired
};

export default NavbarControls;

