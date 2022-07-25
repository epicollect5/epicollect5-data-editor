import React from 'react';
import EC5_LIBRARIES from 'ec5-libraries';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class EC5Search extends React.Component {

    constructor(props, context) {
        super(props, context);

        const { input } = props;

        this.state = {
            isLoading: false
        };

        //set single or multiple search type
        this.multiple = input.type === EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_SEARCH_MULTIPLE_TYPE;
        this.options = input.possible_answers;
        this.onInputChange = props.onInputChange;
        this.answer = props.answer;
        this.possibleAnswersHashMap = {};
        this.parsedAnswers = [];

        //map possible answers array to object for quick lookups
        //const t0 = performance.now();
        input.possible_answers.forEach((possibleAnswer) => {
            this.possibleAnswersHashMap[possibleAnswer.answer_ref] = possibleAnswer.answer;
        });
        //const t1 = performance.now();

        //console.log('Mapping possible answers ' + (Math.round((t1 - t0) * 100) / 100) + ' milliseconds.');

        this.parsedAnswers = this.answer.map((answer) => {
            return {
                answer_ref: answer,
                answer: this.possibleAnswersHashMap[answer]
            };
        });

        //bind "this" to methods
        this.handleSearch = this.handleSearch.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleSearch() {
        this.setState({ isLoading: true });
        window.setTimeout(() => {
            this.setState({
                isLoading: false
            });
        }, 1000);
    }

    handleOnChange(answers) {
        //grab just the answer_ref from the selected answers
        const answersToSave = answers.map((answer) => {
            return answer.answer_ref;
        });
        //pass it up to save
        this.onInputChange(answersToSave);
    }

    render() {
        return (
            <div>
                <AsyncTypeahead
                    {...this.state}
                    defaultSelected={this.parsedAnswers}
                    options={this.options}
                    clearButton
                    labelKey="answer"
                    minLength={1}
                    maxResults={window.EC5_LIBRARIES.PARAMETERS.MAX_SEARCH_HITS}
                    multiple={this.multiple}
                    onSearch={this.handleSearch}
                    placeholder="Type here..."
                    paginate={false}
                    onChange={this.handleOnChange}
                />
            </div>
        );
    }
}

EC5Search.propTypes = {
    answer: React.PropTypes.array,
    onInputChange: React.PropTypes.func,
    input: React.PropTypes.object
};

export default EC5Search;
