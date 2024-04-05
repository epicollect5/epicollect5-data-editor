/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import React from 'react';
import strings from '../constants/strings';

const SaveEntry = ({ saveEntry, isEdit, entry, branchEntries }) => {

    let showBranchesToBeDeletedWarning = false;

    //if a hierarchy edit and some existing branches will be deleted, show warning
    if (isEdit) {
        Object.keys(branchEntries).forEach((ownerInputRef) => {
            //if the ownerInputRef was jumped,this will cause the existing
            //leftover branches to be deleted server side
            if (entry.entry.answers[ownerInputRef].was_jumped === true) {
                //show warning
                showBranchesToBeDeletedWarning = true;
                return false;
            }
        });
    }

    return (
        <div className="ec5-view text-center">
            <button
                className="btn btn-action"
                onClick={saveEntry}
            >
                {strings.save_entry}
            </button>
            {showBranchesToBeDeletedWarning
                ? <p className="ec5-notice">
                    Please be advised that by opting to save,
                    it will trigger the removal of certain existing BRANCH entries
                    as a result of the current conditional flow (JUMPS).
                </p>
                : null
            }
        </div>
    );
};

export default SaveEntry;
