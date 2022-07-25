import React from 'react';
import Confirm from 'react-confirm-bootstrap';
import strings from '../constants/strings';

const BranchEntryRow = ({ uuid, title, errorMessage, deleteBranch, viewEditBranch }) => {

    return (
        <tr>
            <td className="col-sm-8 ec5-table-left">
                {errorMessage} <span>{title}</span>
            </td>
            <td className="col-sm-2">
                <button
                    className="btn btn-action btn-sm"
                    onClick={() => {
                        viewEditBranch(uuid);
                    }}
                >
                    {strings.edit}
                </button>
            </td>
            <td className="col-sm-2">
                <Confirm
                    onConfirm={() => {
                        deleteBranch(uuid);
                    }}
                    body={strings.delete_branch}
                    confirmText="Confirm"
                    title={strings.delete_branch_title}
                    confirmBSStyle="action"
                >
                    <button
                        className="btn btn-danger btn-sm"
                    >
                        {strings.delete}
                    </button>
                </Confirm>
            </td>
        </tr>
    );
};

BranchEntryRow.propTypes = {
    uuid: React.PropTypes.string,
    title: React.PropTypes.string,
    errorMessage: React.PropTypes.object,
    deleteBranch: React.PropTypes.func,
    viewEditBranch: React.PropTypes.func
};

export default BranchEntryRow;
