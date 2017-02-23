/*global casper, module, require*/

const el    = require('../elements');
const funcs = require('../funcs');
const stash = {};

module.exports = function (test) {
    casper.thenOpen(funcs.getUrl('/overview/'));

    // click the planner nav
    casper.waitAndClick(el.nav.planner);
    casper.wrap('PlannerLandingPage', el.planner.createPlan, function () {
        funcs.navExists(test);
    });

    // click create a plan
    casper.waitAndClick(el.planner.createPlan);
    casper.wrap('CreatePlan', el.planner.openPlan.planCompress, function () {
        funcs.itemsPresent(test, 'planner.openPlan');
    });

    // click edit title
    casper.waitAndClick(el.planner.openPlan.editToggle);
    casper.wrap('Edit Plan Details', el.planner.editMeta.name, function () {
        funcs.itemsPresent(test, el.planner.editMeta);
        stash.name = funcs.getRandomString(20);
        this.sendKeys(el.planner.editMeta.name, stash.name);
        casper.thenDebugImage();
    });
};
