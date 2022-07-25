import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastr';
import config from '../../../constants/config';
import parameters from '../../../constants/parameters';
import { ToastMessageFactory, showToastError, showToastSuccess } from '../../../utils/Toast';
import Media from '../../../utils/Media';


class EC5Media extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            files: [],
            uploaded: false,
            showOverlay: false,
            message: this.props.answer === '' ? 'No file selected.' : 'Uploaded File:'
        };

        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(files, rejected) {

        const { answer, uuid, input, formRef, project, statusCodes } = this.props;

        //Check a valid file exists
        if (files.length === 0) {
            //Show toast error
            if (rejected.length === 1) {

                const file = rejected[0];
                //size too big?
                switch (input.type) {
                    case parameters.AUDIO:
                        //max 100MB
                        if (file.size > 100000000) {
                            showToastError(this.container, statusCodes.ec5_206);
                            return;
                        }
                        break;
                    case parameters.VIDEO:
                        //max 500MB
                        if (file.size > 500000000) {
                            showToastError(this.container, statusCodes.ec5_206);
                            return;
                        }
                        break;
                    default:
                        //default is photo type, max 10MB
                        if (file.size > 10000000) {
                            showToastError(this.container, statusCodes.ec5_206);
                            return;
                        }
                }

                //size ok, show general error
                showToastError(this.container, statusCodes.ec5_81);
                return;
            } else {
                showToastError(this.container, statusCodes.ec5_81);
                return;
            }
        }

        let type;
        //Switch for specific media type properties
        switch (input.type) {
            case 'audio':
                type = parameters.AUDIO;
                break;
            case 'video':
                type = parameters.VIDEO;
                break;
            default:
                type = parameters.PHOTO;
        }

        // Update the state then initialise the media upload
        this.setState({
            files,
            uploaded: false,
            message: 'Uploading file...',
            showOverlay: true
        }, () => {
            const media = new Media();

            media.uploadMedia({
                network: this.props.network,
                answer,
                uuid,
                input,
                formRef,
                projectVersion: project.getStructureLastUpdated(),
                slug: project.getSlug(),
                file: files[0],
                type
            })
                .then((fileName) => {
                    // If successful
                    if (fileName) {
                        this.setState({
                            uploaded: true,
                            showOverlay: false,
                            message: 'Uploaded file:'
                        }, () => {
                            this.props.onInputChange(fileName);
                            showToastSuccess(this.container, 'File Uploaded.');
                        });
                    } else {
                        // Unsuccessful
                        this.setState({
                            uploaded: true,
                            showOverlay: false,
                            message: 'Couldn\'t upload file.'
                        }, () => {
                            showToastError(this.container, statusCodes[media.errors[0]]);
                        });
                    }
                });
        });
    }

    render() {

        const { project, input, network, answer, uuid } = this.props;

        let mediaUrl;
        let fileSource;

        let htmlComponent = null;
        let mimeTypes;
        let maxSize;
        let format;
        const baseUrl = `${network.serverUrl}${network.api}${config.TEMP_MEDIA_URL}/${project.getSlug()}?type=${input.type}&name=${answer}`;
        const otherUrlParams = `entry_uuid=${uuid}&timestamp=${new Date()}&jwt=${network.jwtToken}`;

        const elementClass = 'ec5-' + input.type;
        let acceptedFormats = '';

        // Switch for specific media type properties
        switch (input.type) {
            case 'audio':
                format = 'audio';
                mediaUrl = answer !== '' ?
                    `${baseUrl}&format=${format}&${otherUrlParams}` : '';

                fileSource = this.state.files.length > 0 ? this.state.files[0].preview : mediaUrl;
                htmlComponent = (
                    <audio
                        className="ec5-media"
                        controls
                        src={fileSource}

                    />);
                mimeTypes = 'audio/mp4,audio/wav,video/mp4';
                maxSize = 100 * 1000 * 1000;//bytes
                acceptedFormats = 'mp4 or wav only, max file size 100 MB';
                break;
            case 'video':
                format = 'video';
                mediaUrl = answer !== '' ?
                    `${baseUrl}&format=${format}&${otherUrlParams}` : '';

                fileSource = this.state.files.length > 0 ? this.state.files[0].preview : mediaUrl;
                htmlComponent = (
                    <video
                        className="ec5-media"
                        controls
                        src={fileSource}
                    />);
                mimeTypes = 'video/mp4';
                maxSize = 500000000;//bytes
                acceptedFormats = 'mp4 only, max file size 500 MB';
                break;
            default:
                format = 'entry_original';
                mediaUrl = answer !== '' ?
                    `${baseUrl}&format=${format}&${otherUrlParams}` : '';

                fileSource = this.state.files.length > 0 ? this.state.files[0].preview : mediaUrl;
                htmlComponent = (
                    <img
                        alt={this.props.answer}
                        src={fileSource}
                    />);
                // htmlComponent = (
                //     <EC5Photo
                //         project={project}
                //         files={this.state.files}
                //         answer={answer}
                //         input={input}
                //         uuid={uuid}
                //         network={network}
                //     />
                // );
                mimeTypes = 'image/jpeg, image/jpg, image/png, image/gif';
                maxSize = 10000000;//bytes
                acceptedFormats = 'jpeg or png only, max file size 10 MB, max resolution 4096 x 4096px';
        }

        return (
            <div>

                <div
                    className={this.state.showOverlay ? 'overlay' : 'overlay hidden'}
                >
                    <span>Uploading file, please wait...</span>
                </div>

                <ToastContainer
                    toastMessageFactory={ToastMessageFactory}
                    ref={(container) => {
                        this.container = container;
                    }}
                    className="toast-top-full-width"
                />

                <Dropzone
                    className={elementClass}
                    accept={mimeTypes}
                    onDrop={this.onDrop}
                    multiple={false}
                    maxSize={maxSize}
                >
                    <div className="media-file-preview">
                        <div>Drop {input.type} file or click here.</div>
                        <p><strong>{acceptedFormats}</strong></p>
                        <p>{this.state.message}</p>
                    </div>
                    {fileSource !== '' ? htmlComponent : null}
                </Dropzone>
            </div>
        );
    }
}

function mapStateToProps(state) {

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

EC5Media.propTypes = {
    uuid: React.PropTypes.string,
    answer: React.PropTypes.string,
    formRef: React.PropTypes.string,
    project: React.PropTypes.object,
    input: React.PropTypes.object,
    onInputChange: React.PropTypes.func,
    network: React.PropTypes.object,
    statusCodes: React.PropTypes.object
};

export default connect(mapStateToProps)(EC5Media);
