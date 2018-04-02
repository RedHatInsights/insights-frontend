/*global module*/

const pub = {};
const SUMMIT_DEMO_FIXED_STATUS = 'summitDemoFixedStatus';

pub.isFixed = () => {
    let summitDemoFixedStatus = window.localStorage.getItem(SUMMIT_DEMO_FIXED_STATUS);
    return summitDemoFixedStatus === 'true';
};

pub.reset = () => {
    console.log('Resetting Data');
    window.localStorage.setItem(SUMMIT_DEMO_FIXED_STATUS, 'false');
    console.log('status = ', pub.isFixed());
};

pub.applyFixes = () => {
    console.log('Applying Fixes');
    window.localStorage.setItem(SUMMIT_DEMO_FIXED_STATUS, 'true');
    console.log('status = ', pub.isFixed());
};

module.exports = pub;
