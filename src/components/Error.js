import React from 'react';

const Error = ({ message }) => {

    return (
        <div className="ec5-view">
            <h4 className="ec5-error">{message}</h4>
        </div>
    );
};

Error.propTypes = {
    message: React.PropTypes.string
};

export default Error;
