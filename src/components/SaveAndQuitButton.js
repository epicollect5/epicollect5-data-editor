import React, { Component } from 'react';
import Confirm from 'react-confirm-bootstrap';
import strings from '../constants/strings';

class SaveAndQuitButton extends Component {

    /**
     *
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);

        this.state = {
            visible: false
        };

    }

    render() {

        const { saveAndQuit, disableButton } = this.props;

        return (
            <div className="ec5-btn-right">
                <Confirm
                    onConfirm={saveAndQuit}
                    body={strings.are_you_sure_save_and_quit}
                    confirmText="Confirm"
                    title={strings.save_and_quit}
                    confirmBSStyle="action"
                >
                    <button
                        disabled={disableButton ? 'disabled' : ''}
                        className="btn btn-default btn-action-inverse ec5-btn-margin-right"
                    >
                        {strings.save}
                    </button>
                </Confirm>
            </div>
        );

    }
}

SaveAndQuitButton.propTypes = {
    saveAndQuit: React.PropTypes.func,
    disableButton: React.PropTypes.bool
};

export default SaveAndQuitButton;
