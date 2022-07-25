import React, { Component } from 'react';
import BootstrapProgressBar from './BootstrapProgressBar';

class ProgressBar extends Component {

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

        const { disablePrevious, disableNext, previousQuestion, nextQuestion, progress } = this.props;

        return (
            <div className="ec5-progress">
                <button
                    className="btn btn-progress ec5-btn-left ec5-btn-progress"
                    disabled={disablePrevious ? 'disabled' : ''}
                    onClick={() => {
                        previousQuestion();
                    }}
                >
                    <i className="material-icons">arrow_back</i>
                </button>
                <button
                    className="btn btn-progress ec5-btn-right ec5-btn-progress"
                    disabled={disableNext ? 'disabled' : ''}
                    onClick={() => {
                        nextQuestion();
                    }}
                >
                    <i className="material-icons">arrow_forward</i>
                </button>
                <BootstrapProgressBar width={progress}/>
            </div>
        );

    }
}

ProgressBar.propTypes = {
    progress: React.PropTypes.number,
    disablePrevious: React.PropTypes.bool,
    disableNext: React.PropTypes.bool,
    previousQuestion: React.PropTypes.func,
    nextQuestion: React.PropTypes.func
};

export default ProgressBar;
