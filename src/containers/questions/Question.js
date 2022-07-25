import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAnswer, setConfirmAnswer } from '../../actions/answer';
import EC5Text from '../../components/inputs/EC5Text';
import EC5Integer from '../../components/inputs/EC5Integer';
import EC5Decimal from '../../components/inputs/EC5Decimal';
import EC5Time from '../../components/inputs/EC5Time';
import EC5Date from '../../components/inputs/EC5Date';
import EC5Location from '../../components/inputs/EC5Location';
import EC5Radio from '../../components/inputs/EC5Radio';
import EC5Checkbox from '../../components/inputs/EC5Checkbox';
import EC5Dropdown from '../../components/inputs/EC5Dropdown';
import EC5Search from '../../components/inputs/EC5Search';
import EC5Dataset from '../inputs/EC5Dataset';
import EC5Media from '../inputs/Media/EC5Media';
import EC5Readme from '../../components/inputs/EC5Readme';
import EC5Textarea from '../../components/inputs/EC5Textarea';
import EC5Phone from '../../components/inputs/EC5Phone';
import Loader from '../../components/Loader';
import Answers from '../../utils/Answers';

class Question extends Component {

    /**
     *
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);

        //Create new Answers utils instance
        const answers = new Answers();

        //Get the default answer
        const answer = answers.getDefaultAnswer(this.props.answers, this.props.input);

        this.state = {
            answer,
            confirmAnswer: ''
        };

        //List of available components
        this.components = {
            text: EC5Text,
            integer: EC5Integer,
            decimal: EC5Decimal,
            phone: EC5Phone,
            time: EC5Time,
            date: EC5Date,
            radio: EC5Radio,
            dropdown: EC5Dropdown,
            checkbox: EC5Checkbox,
            location: EC5Location,
            photo: EC5Media,
            video: EC5Media,
            audio: EC5Media,
            readme: EC5Readme,
            textarea: EC5Textarea,
            barcode: EC5Text,
            searchsingle: EC5Search,
            searchmultiple: EC5Search,
            datasetsingle: EC5Dataset,
            datasetmultiple: EC5Dataset
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onConfirmInputChange = this.onConfirmInputChange.bind(this);
    }

    componentWillMount() {
        //Set the initial answer by calling the setAnswer action
        this.props.setAnswer(this.state.answer, this.props.currentInputRef);
    }

    onInputChange(answer) {

        this.setState({
            answer
        }, () => {
            //Dispatch the setAnswer action to store the answer in the state
            this.props.setAnswer(answer, this.props.currentInputRef);
        });
    }

    onConfirmInputChange(confirmAnswer) {

        this.setState({
            confirmAnswer
        }, () => {
            //Dispatch the SET_CONFIRM_ANSWER action to store the answer in the state
            this.props.setConfirmAnswer(confirmAnswer, this.props.currentInputRef);
        });
    }

    getInputAttributes() {

        const input = this.props.input;
        const attributes = [];

        if (input.is_required) {
            attributes.push(<span key={0} className="ec5-input-attribute">* Required</span>);
        }

        if (input.regex) {
            attributes.push(<span key={1} className="ec5-input-attribute">Match: {input.regex}</span>);
        }

        if (input.min !== null && input.min !== '') {
            attributes.push(<span key={2} className="ec5-input-attribute">Min: {input.min}</span>);
        }

        if (input.max !== null && input.max !== '') {
            attributes.push(<span key={3} className="ec5-input-attribute">Max: {input.max}</span>);
        }

        if (input.datetime_format !== null) {
            attributes.push(<span key={3} className="ec5-input-attribute">({input.datetime_format})</span>);
        }

        return attributes;

    }

    getQuestionHeader(input) {

        if (input.type !== 'readme') {
            return (
                <div className="ec5-label">
                    <p>{input.question}</p>
                    {this.getInputAttributes()}
                </div>
            );
        }

    }

    /**
     * Return the Component needed based on the input type
     *
     * @returns {{question: (XML|*), confirmQuestion: *}}
     */
    renderType() {

        const { uuid, input, errors, focus, statusCodes } = this.props;

        const answer = this.state.answer;
        const confirmAnswer = this.state.confirmAnswer;
        let confirmQuestion;

        let errorMessage = '';

        if (errors[uuid] && errors[uuid][input.ref]) {
            errorMessage = (statusCodes[errors[uuid][input.ref][0]]);
        }

        //Get input component based on type
        const InputComponent = this.components[input.type];
        const questionHeader = this.getQuestionHeader(input);

        const question = (
            <div
                className="form-group ec5-card col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1"
            >
                {questionHeader}
                <div className="ec5-input">
                    {errorMessage ?
                        <span className="ec5-error">{errorMessage}</span>
                        : ''
                    }
                    <InputComponent
                        answer={answer}
                        onInputChange={this.onInputChange}
                        input={input}
                        uuid={uuid}
                        focus={focus}
                    />
                </div>

            </div>
        );
        if (input.verify) {
            confirmQuestion = (
                <div className="form-group ec5-card col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1">
                    {errorMessage ?
                        <span className="ec5-error">{errorMessage}</span>
                        : ''
                    }
                    <div className="ec5-label"><p>Confirm Answer</p></div>
                    <div className="ec5-input">
                        <InputComponent
                            answer={confirmAnswer}
                            onInputChange={this.onConfirmInputChange}
                            input={input}
                        />
                    </div>
                </div>
            );
        }

        return {
            question,
            confirmQuestion
        };
    }

    render() {

        const { isValidating } = this.props;

        // If we're validating, show loader
        if (isValidating) {
            return (
                <Loader />
            );
        }

        const { question, confirmQuestion } = this.renderType();
        return (
            <div>
                {question}
                {confirmQuestion}
            </div>
        );
    }
}

function mapStateToProps(state) {

    const { answerReducer, validatorReducer, generalReducer } = state;
    const { answers } = answerReducer;
    const { errors, isValidating } = validatorReducer;
    const { statusCodes } = generalReducer;
    return {
        answers,
        errors,
        isValidating,
        statusCodes
    };
}

Question.propTypes = {
    uuid: React.PropTypes.string,
    input: React.PropTypes.object,
    errors: React.PropTypes.object,
    focus: React.PropTypes.bool,
    isValidating: React.PropTypes.bool,
    answers: React.PropTypes.object,
    currentInputRef: React.PropTypes.string,
    setAnswer: React.PropTypes.func,
    setConfirmAnswer: React.PropTypes.func,
    statusCodes: React.PropTypes.object
};

export default connect(mapStateToProps, { setAnswer, setConfirmAnswer })(Question);
