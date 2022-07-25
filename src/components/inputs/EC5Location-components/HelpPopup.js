import React from 'react';
import Modal from 'react-bootstrap-modal';
import strings from '../../../constants/strings';
import config from '../../../constants/config';

class HelpPopup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

        this.onHandleOpen = this.onHandleOpen.bind(this);
        this.onHandleClose = this.onHandleClose.bind(this);
    }

    onHandleOpen() {
        this.setState({
            open: true
        });
    }

    onHandleClose() {
        this.setState({
            open: false
        });
    }

    render() {

        const mediaPath = config.STAND_ALONE ? '' : '/data-editor';

        return (
            <span className="help-popup">
                <button
                    type="button" className="btn btn-sm btn-action-inverse-bright"
                    onClick={this.onHandleOpen}
                >
                    {strings.help}
                     </button>
                <Modal
                    show={this.state.open}
                    onHide={this.onHandleClose}
                    aria-labelledby="ModalHeader"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="ModalHeader" className="text-center">
                            {strings.how_do_i_get_location}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul>
                            <li>Type in an address and click &nbsp;
                                <button className="btn btn-action btn-sm">Search</button>
                            </li>
                            <hr/>
                            <li>Type in a latitude and longitude value and click &nbsp;
                                <button className="btn btn-action btn-sm">Update Location</button>
                            </li>
                            <hr/>
                            <li>Click the <img
                                className="locate-me-icon" alt="target"
                                src={mediaPath + '/vendor/css/images/locate-me@2x.png'}
                            />
                                icon to locate your current
                                position
                            </li>
                            <hr/>
                            <li>Drag the marker <img
                                width="20"
                                className="marker-icon" alt="target"
                                src={mediaPath + '/vendor/css/images/marker-icon-2x.png'}
                            /> anywhere you want
                            </li>
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Modal.Dismiss className="btn btn-default">{strings.dismiss}</Modal.Dismiss>

                    </Modal.Footer>
                </Modal>
            </span>
        );
    }
}

export default HelpPopup;
