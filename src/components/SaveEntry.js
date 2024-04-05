/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import React from 'react';
import strings from '../constants/strings';

const SaveEntry = ({ saveEntry, isEdit, entry, showBranchesToBeDeletedWarning }) => {

    return (
        <div className="ec5-view text-center">
            <button
                className="btn btn-action"
                onClick={saveEntry}
            >
                {strings.save_entry}
            </button>
            {/* if a hierarchy edit and some existing branches will be deleted, show warning */}
            {isEdit && showBranchesToBeDeletedWarning
                ? <p className="ec5-notice">
                    Please be advised that by opting to save,
                    it might trigger the removal of certain existing BRANCH entries
                    as a result of the current conditional flow (JUMPS).
                    <a
                        href="https://docs.epicollect.net/formbuilder/jumps#jumps-and-branches"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <strong> More info </strong>
                    </a>
                </p>

                : null
            }
        </div>
    );
};

export default SaveEntry;
