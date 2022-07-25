import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import config from '../../../constants/config';

class EC5Photo extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            imageLoaded: false
        };

        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.handleImageErrored = this.handleImageErrored.bind(this);

    }

    handleImageLoaded() {
        console.log('here');
        this.setState({ imageLoaded: true });
    }

    handleImageErrored() {
        this.setState({ imageLoaded: false });
    }

    render() {

        const { project, files, answer, input, uuid, network } = this.props;

        const baseUrl = `${network.serverUrl}${network.api}${config.TEMP_MEDIA_URL}/${project.getSlug()}?type=${input.type}&name=${answer}`;
        const otherUrlParams = `entry_uuid=${uuid}&timestamp=${new Date()}&jwt=${network.jwtToken}`;
        const format = 'entry_original';
        const mediaUrl = answer !== '' ?
            `${baseUrl}&format=${format}&${otherUrlParams}` : '';

        const fileSource = files.length > 0 ? files[0].preview : mediaUrl;

        console.log(this.state.imageLoaded, fileSource);

        if (fileSource !== '') {

            if (!this.state.imageLoaded) {
                return (
                    <div>
                        <img
                            alt={answer}
                            src={fileSource}
                            onLoad={this.handleImageLoaded}
                            onError={this.handleImageErrored}
                        />
                        <Loader />
                    </div>
                );
            }
            return (
                <div>
                    <img
                        alt={answer}
                        src={fileSource}
                        onLoad={this.handleImageLoaded}
                        onError={this.handleImageErrored}
                    />
                </div>
            );
        }

        return (null);
    }
}

EC5Photo.propTypes = {
    answer: React.PropTypes.string
};

export default EC5Photo;
