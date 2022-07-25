/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchProject } from '../actions/project';
import { addFormRef } from '../actions/form';
import { external, internal, resetAppComplete, fetchStatusCodes } from '../actions/general';
import Form from './Form';
import Branch from './Branch';
import Error from '../components/Error';
import config from '../constants/config';
import Loader from '../components/Loader';

class App extends Component {

    constructor(props, context) {
        super(props, context);

        const queryStringParams = this.getQueryStringParams();
        const projectSlug = window.location.pathname.split('/')
            .splice(-2, 1);
        let formRef = queryStringParams.form_ref;
        let serverUrl = window.location.href;
        serverUrl = serverUrl.slice(0, serverUrl.lastIndexOf('/'));
        serverUrl = serverUrl.slice(0, serverUrl.lastIndexOf('/'));
        serverUrl = serverUrl.slice(0, serverUrl.lastIndexOf('/'));

        // Set the state for this component
        this.state = {
            projectSlug,
            formRef,
            uuid: queryStringParams.uuid,
            parentEntryUuid: queryStringParams.parent_uuid,
            parentFormRef: queryStringParams.parent_form_ref,
            ownerInputRef: queryStringParams.branch_ref,
            ownerEntryUuid: queryStringParams.branch_owner_uuid,
            inputRef: queryStringParams.input_ref,
            serverUrl: config.STAND_ALONE ? process.env.DEVELOPMENT_SERVER_URL : serverUrl,
            jwtToken: queryStringParams.token
        };

        let url;
        // Decide whether to use internal/external api
        if (this.state.jwtToken) {
            this.props.external(this.state.serverUrl, config.API_EXTERNAL_URL, this.state.jwtToken);
            url = this.state.serverUrl + config.API_EXTERNAL_URL;
        } else {
            this.props.internal(this.state.serverUrl, config.API_INTERNAL_URL);
            url = this.state.serverUrl + config.API_INTERNAL_URL;
        }

        // Fetch the ec5 status codes
        this.props.fetchStatusCodes(this.state.serverUrl)
            .then(() => {

                // Fetch the project
                this.props.fetchProject(url + config.PROJECT_URL, this.state.projectSlug, this.state.jwtToken)
                    .then(() => {

                        // Then set the form ref
                        // Check project is loaded and check we have a valid form ref
                        if (!this.props.isRejected && !this.props.project.formExists(formRef)) {
                            // If not, default to the first form
                            formRef = this.props.project.getFirstFormRef();
                            this.setState({
                                formRef
                            });
                        }

                        // Set the form ref
                        this.props.addFormRef({ formRef });

                    });

            });

        this.getQueryStringParams = this.getQueryStringParams.bind(this);

    }

    componentDidUpdate () {

        const { isResetting } = this.props;

        // Check if the app is resetting
        // And we're in a modal
        if (isResetting) {
            // We have now reset the app
            this.props.resetAppComplete();
        }

    }

    /**
     * Get quest string params
     * See: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
     * @returns {{}}
     */
    getQueryStringParams () {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        const queryString = {};
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            //If first entry with this name
            if (typeof queryString[pair[0]] === 'undefined') {
                queryString[pair[0]] = decodeURIComponent(pair[1]);
                //If second entry with this name
            } else if (typeof queryString[pair[0]] === 'string') {
                queryString[pair[0]] = [queryString[pair[0]], decodeURIComponent(pair[1])];
                //If third or later entry with this name
            } else {
                queryString[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return queryString;
    }

    render () {

        const { isFetching, isResetting, isFulfilled, isRejected, error, project, statusCodes } = this.props;
        const { formRef, uuid, ownerEntryUuid, ownerInputRef, parentEntryUuid, parentFormRef, inputRef } = this.state;

        if (isRejected) {
            return (
                <div className="animated fadeIn">
                    <Error
                        message={statusCodes[error.message]}
                    />
                </div>
            );
        }
        //If fetching, not fulfilled, resetting or have no valid formRef, reset
        if (isFetching || !isFulfilled || isResetting || !project.formExists(formRef)) {
            return (
                <div>
                    <Loader />
                </div>
            );
        }

        //Branch
        if (ownerInputRef && ownerEntryUuid) {
            const ownerInput = project.getInput(ownerInputRef);
            return (
                <div className="animated fadeIn">
                    <Branch
                        formRef={formRef}
                        uuid={uuid}
                        ownerInput={ownerInput}
                        ownerEntryUuid={ownerEntryUuid}
                    />
                </div>
            );
        }

        // Form
        return (
            <div className="animated fadeIn">
                <Form
                    formRef={formRef}
                    uuid={uuid}
                    parentEntryUuid={parentEntryUuid}
                    parentFormRef={parentFormRef}
                    inputRef={inputRef}
                />
            </div>
        );
    }

}

function mapStateToProps (state) {

    const { projectReducer, uploadReducer, generalReducer } = state;
    const { project, projectSlug, isFetching, isFulfilled, isRejected, error } = projectReducer;
    const { hasUploaded } = uploadReducer;
    const { isResetting, statusCodes } = generalReducer;
    return {
        isFetching,
        isFulfilled,
        isRejected,
        error,
        project,
        projectSlug,
        hasUploaded,
        isResetting,
        statusCodes
    };
}

App.propTypes = {
    isFetching: React.PropTypes.bool,
    isFulfilled: React.PropTypes.bool,
    isRejected: React.PropTypes.bool,
    isResetting: React.PropTypes.bool,
    error: React.PropTypes.object,
    project: React.PropTypes.object,
    fetchProject: React.PropTypes.func,
    addFormRef: React.PropTypes.func,
    external: React.PropTypes.func,
    internal: React.PropTypes.func,
    resetAppComplete: React.PropTypes.func
};

export default connect(mapStateToProps, {
    fetchProject,
    external,
    internal,
    addFormRef,
    resetAppComplete,
    fetchStatusCodes
})(App);
