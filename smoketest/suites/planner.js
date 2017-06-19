/*global describe, it module, require*/

const el    = require('../elements.js');
const funcs = require('../funcs');

module.exports = (nightmare) => {
    describe('Planner', () => {
        it('should let you create a plan', (done) => {
            const name = `SmokeTest_${funcs.getRandomString(20)}`;

            nightmare
                // nav to planner
                .waitAndClick(el.nav.planner)
                .waitAll('nav')

                // click create plan
                .waitAndClick(el.planner.createPlan)
                .waitAll('planner.createModal')

                // insert title
                .insert(el.planner.createModal.name, name)
                .waitAndClick(el.planner.createModal.firstAction) // .check() does not work in our app
                .waitAndClick(el.planner.createModal.save)

                // verify the name is now changed
                .wait(el.planner.openPlan.name)
                .evaluate((el) => {
                    return document.querySelector(el.planner.openPlan.name).textContent;
                }, el)
                .then((newName) => {
                    newName.should.match(new RegExp(`^${name}.*`));
                    nightmare
                        .waitAndClick(el.planner.openPlan.delete)
                        .waitAndClick(el.planner.swal.yes)
                        .then(done)
                        .catch(done);
                        // TODO confirm delete
                }).catch(done);
        });
    });
};
