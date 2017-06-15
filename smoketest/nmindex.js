/*global require, describe, it*/
const Nightmare = require('nightmare');
const expect = require('chai').expect; // jshint ignore:line

describe('test duckduckgo search results', () => {
    it('should find the nightmare github link first', (done) => {
        const nightmare = Nightmare();
        nightmare
            .goto('https://duckduckgo.com')
            .type('#search_form_input_homepage', 'github nightmare')
            .click('#search_button_homepage')
            .wait('#zero_click_wrapper .c-info__title a')
            .evaluate(function () {
                return document.querySelector('#zero_click_wrapper .c-info__title a').href;
            })
            .end()
            .then((link) => {
                expect(link).to.equal('https://github.com/segmentio/nightmare');
                done();
            });
    });
});
