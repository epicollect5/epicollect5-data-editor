import React from 'react';
import { connect } from 'react-redux';
import EC5_LIBRARIES from 'ec5-libraries';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import config from '../../constants/config';

class EC5Dataset extends React.Component {

    constructor(props, context) {
        super(props, context);
        const { input, project } = props;
        this.dataset = input.possible_answers[0];
        this.state = {
            isLoading: false,
            options: []
        };

        //set single or multiple search type
        this.multiple = input.type === EC5_LIBRARIES.PARAMETERS.INPUT_TYPES.EC5_DATASET_MULTIPLE_TYPE;
        this.type = input.type;
        this.onInputChange = props.onInputChange;
        this.answer = props.answer;
        this.parsedAnswers = [];
        this.endpoint = process.env.DEVELOPMENT_SERVER_URL + config.API_INTERNAL_URL + config.DATASETS_URL;
        this.endpoint += project.getSlug();
        this.endpoint += '/' + this.dataset.dataset_uuid;
        this.endpoint += '?filename=' + this.dataset.dataset_filename;
        this.endpoint += '&column_index=' + this.dataset.dataset_column_index;

        this.parsedAnswers = this.answer.map((answer) => {
            return answer;
        });

        //bind "this" to methods
        this.handleSearch = this.handleSearch.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    handleSearch (query) {

        //add query search to endpoint
        this.endpoint += '&search=' + encodeURIComponent(query);

        /**
         *  DEBUGGING ON STANDALONE DATA EDITOR
         * change laravel controller to avoid permission and embed the project ref manually
         *use ngrok as proxy for localhost and set it as development server
         * expose the routes to external api
         **********************************************************************************/

        this.setState({ isLoading: true });
        fetch(this.endpoint, {})
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return {};
            })
            .then((json) => {

                if (json.data) {

                    //map result to have an array of hits (comes as array of arrays)
                    const hits = json.data.dataset.rows.map((row) => {
                        //just get the values at 0 index, as other colums are filtered out by the api
                        return row[0];
                    });

                    this.setState({
                        isLoading: false,
                        options: hits
                    });
                } else {
                    this.setState({
                        isLoading: false
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    isLoading: false
                });
            });
    }

    handleOnChange (answers) {

        //grab just the answer_ref from the selected answers
        const answersToSave = answers.map((answer) => {
            return answer;
        });
        //pass it up to save
        this.onInputChange(answersToSave);
    }

    render () {
        return (
            <div>
                <AsyncTypeahead
                    className={this.type}
                    {...this.state}
                    delay={500}
                    defaultSelected={this.parsedAnswers}
                    options={this.state.options}
                    clearButton
                    labelKey="answer"
                    minLength={1}
                    maxResults={window.EC5_LIBRARIES.PARAMETERS.MAX_DATASET_HITS}
                    multiple={this.multiple}
                    onSearch={(query) => {
                        this.handleSearch(query);
                    }}
                    placeholder="Type here..."
                    paginate={false}
                    onChange={this.handleOnChange}
                />
            </div>
        );
    }
}

function mapStateToProps (state) {

    const { projectReducer, formReducer, generalReducer } = state;
    const { project } = projectReducer;
    const { formRef } = formReducer;
    const { network, statusCodes } = generalReducer;

    return {
        project,
        formRef,
        network,
        statusCodes
    };
}

EC5Dataset.propTypes = {
    answer: React.PropTypes.array,
    onInputChange: React.PropTypes.func,
    input: React.PropTypes.object,
    project: React.PropTypes.object
};

export default connect(mapStateToProps)(EC5Dataset);
