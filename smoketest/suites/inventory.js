/*global describe, it module, require*/

const el = require('../elements.js');

module.exports = (nightmare) => {
    describe('Inventory', () => {
        it('should be able to get to the System Modal through Inventory', (done) => {
            return nightmare
                .waitAndClick(el.nav.inventory)
                .waitAll('nav')
                .waitAll('inventory')
                .evaluate((el) => {
                    return document.querySelector(el.inventory.firstSystemInTable).textContent;
                }, el)
                .then((systemName) => {
                    nightmare.click(el.inventory.firstSystemInTable)
                        .waitAll('systemModal')
                        .evaluate((el, systemName) => {
                            return {
                                systemName: systemName,
                                hostName: document.querySelector(el.systemModal.hostname).textContent
                            };
                        }, el, systemName)
                        .then((o) => {
                            o.systemName.should.equal(o.hostName);
                            nightmare.waitAndClick(el.systemModal.exButton)
                                .waitAll('nav')
                                .then(done)
                                .catch(done);
                        }).catch(done);
                }).catch(done);
        });
    });
};
