import React from 'react';
import strings from '../constants/strings';

const SaveEntry = ({ saveEntry }) => {

    return (
        <div className="ec5-view text-center">
            <button
                className="btn btn-action"
                onClick={saveEntry}
            >
                {strings.save_entry}
            </button>
        </div>
    );
};

export default SaveEntry;
