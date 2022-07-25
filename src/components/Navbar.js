import React from 'react';
import Confirm from 'react-confirm-bootstrap';
import strings from '../constants/strings';

const NavBar = ({ name, quit, projectLogo }) => {

    return (
        <div>
            <nav className="primary-navbar animated fadeIn navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header pull-left">
                        <span className="navbar-brand">
                                <Confirm
                                    onConfirm={quit}
                                    body={strings.want_to_quit}
                                    confirmText="Confirm"
                                    title={strings.quit}
                                    confirmBSStyle="action"
                                >
                                    <a
                                        href="#"
                                    >
                                        <img
                                            className="navbar-project-logo"
                                            src={projectLogo}
                                            width="40"
                                            height="40"
                                            alt="Logo"
                                        />
                                    </a>
                                </Confirm>
                            <span className="navbar-project-name">{name}</span>
                        </span>
                    </div>
                    <div className="pull-right navbar-exit">
                        <ul className="nav navbar-nav">
                            <li role="presentation" className="">
                                <Confirm
                                    onConfirm={quit}
                                    body={strings.want_to_quit}
                                    confirmText="Confirm"
                                    title={strings.quit}
                                    confirmBSStyle="action"
                                >
                                    <a
                                        role="button"
                                        href="#"
                                    >
                                        <i className="material-icons">power_settings_new</i>
                                        <span className="navbar-exit__btn-label">&nbsp;Exit</span>
                                    </a>
                                </Confirm>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>);
};

NavBar.propTypes = {
    name: React.PropTypes.string,
    quit: React.PropTypes.func,
    projectLogo: React.PropTypes.string
};

export default NavBar;
