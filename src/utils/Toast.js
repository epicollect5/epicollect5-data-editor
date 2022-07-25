import React, { Component } from 'react';
import { ToastContainer, ToastMessage } from 'react-toastr';

export const ToastMessageFactory = React.createFactory(ToastMessage.animation);

/**
 *
 * @param container (usually this.container from calling component)
 * @param message
 */
export const showToastSuccess = (container, message) => {
    container.clear();
    container.success(message, '', {
        closeButton: true,
        timeOut: 1000,
        extendedTimeOut: 0,
        showAnimation: 'animated fadeIn',
        hideAnimation: 'animated fadeOut',
        preventDuplicates: true
    });
};

/**
 *
 * @param container (usually this.container from calling component)
 * @param message
 */
export const showToastError = (container, message) => {
    container.clear();
    container.error(message, '', {
        closeButton: true,
        timeOut: 0,
        extendedTimeOut: 0,
        showAnimation: 'animated fadeIn',
        hideAnimation: 'animated fadeOut',
        preventDuplicates: true
    });
};

