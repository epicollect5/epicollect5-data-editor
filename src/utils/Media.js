import EC5_LIBRARIES from 'ec5-libraries';
import fetch from 'isomorphic-fetch';
import config from '../constants/config';
import parameters from '../constants/parameters';
import { getAuthorisationHeader, generateMediaFilenameWeb } from '../utils/Utils';

export default class Media {

    /**
     *
     */
    constructor() {
        this.errors = [];
    }

    /**
     * Upload a media file
     *
     * @param props
     * @returns {*}
     */
    uploadMedia(props) {

        const projectSlug = props.slug;

        // Get file extension from dropped file
        let ext = props.file.name.split('.').pop();
        // Use jpg for all images
        if (props.type === 'photo') {
            ext = 'jpg';
        }

        let answer = props.answer;
        // If empty, create a new answer (file name)
        if (props.answer === '') {
            answer = generateMediaFilenameWeb(props.uuid, ext);
        }

        const data = new FormData();

        // Create upload data
        const uploadData = EC5_LIBRARIES.JsonFormatter.makeJsonFileEntry(
            {
                entry_uuid: props.uuid,
                form_ref: props.formRef,
                file_name: answer,
                file_type: props.type,
                input_ref: props.input.ref,
                structure_last_updated: props.projectVersion,
                created_at: new Date().toISOString(),
                platform: parameters.WEB,
                device_id: ''
            }
        );

        // Add stringified upload data to api request
        data.append('data', JSON.stringify(uploadData));
        // Add file to api request
        data.append('file', props.file);

        const options = Object.assign({}, config.FETCH_OPTIONS);
        options.body = data;
        options.method = 'POST';

        // Set headers
        const headers = Object.assign({}, options.headers);
        headers.Authorization = getAuthorisationHeader(props.network.jwtToken);
        // Remove the Content-Type, as sending multipart instead
        delete headers['Content-Type'];
        options.headers = headers;

        // POST the data
        return fetch(`${props.network.serverUrl}${props.network.api}${config.FILE_UPLOAD_URL}/${projectSlug}`, options)
            .then((response) => {
                return response.json();
            }).then((json) => {

                // Check if any errors
                if (json.errors && json.errors[0]) {
                    // Show toast for first error
                    this.errors = [json.errors[0].code];
                    return false;
                }

                return answer;

            }).catch((err) => {
                console.log(err);
                this.errors = ['ec5_116'];
                return false;
            });

    }

}
