import React from 'react';

const LocateMe = (props) => {
    return (
        <div className="locate-me">
            <button
                className="btn btn-action btn-locate-me btn-sm"
                onClick={props.handleLocateMe}
            >
                <i className="material-icons">&#xE1B7;</i>
            </button>
        </div>

    );
};

LocateMe.propTypes = {
    handleLocateMe: React.PropTypes.func.isRequired
};

export default LocateMe;

