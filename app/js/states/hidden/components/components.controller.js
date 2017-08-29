/*global require*/
'use strict';

var statesModule = require('../../');

const mdc = require('material-components-web/dist/material-components-web');

//const mdcTextField = require('@material/textfield');

function ComponentsCtrl() {
    mdc.textfield.MDCTextfield.attachTo(document.querySelector('.mdc-textfield'));
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-icon-toggle'));
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
    mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-fab'));
    mdc.autoInit();
}

statesModule.controller('ComponentsCtrl', ComponentsCtrl);
