import React from 'react';

const BootstrapProgressBar = ({ width }) => {
    return (
        <div className="progress ec5-progress-bar">
            <span className="ec5-progress-text">{ width + '%' }</span>
            <div
                role="progressbar"
                className="progress-bar"
                style={{ width: width + '%' }}
                aria-valuenow={width + '%'}
                aria-valuemin="0"
                aria-valuemax="100"
            >
            </div>
        </div>
    );
};


BootstrapProgressBar.propTypes = {
    width: React.PropTypes.number
};

export default BootstrapProgressBar;
