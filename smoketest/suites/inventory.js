/*global describe, it module, require*/

const el = require('../elements.js');

module.exports = (nightmare) => {
    describe('Inventory', () => {
        it('should be able to get to the System Modal through Inventory', (done) => {
            nightmare
                .waitAndClick(el.nav.inventory)
                .waitAll('nav')
                .waitAll('inventory')
                .getText(el.inventory.firstSystemInTable)
                .then((systemName) => {
                    nightmare.click(el.inventory.firstSystemInTable)
                        .waitAll('systemModal')
                        .getText(el.systemModal.hostname)
                        .then((hostName) => {
                            systemName.should.equal(hostName);
                            nightmare.waitAndClick(el.systemModal.exButton)
                                .waitAll('nav')
                                .then(done)
                                .catch(done);
                        }).catch(done);
                }).catch(done);
        });
    });
};
