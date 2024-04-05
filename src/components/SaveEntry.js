/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import React from 'react';
import strings from '../constants/strings';

const SaveEntry = ({ saveEntry, isEdit, entry, branchEntries }) => {

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
