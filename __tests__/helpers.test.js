const { ExpressHandlebars } = require("express-handlebars");
const{ format_date, format_plural, format_url } = require('../utils/helpers');
// const { format_plural } = require("../utils/helpers");

test('format_date() returns a date string', () => {
    const date = new Date('2021-06-29 16:12:03')

    expect(format_date(date)).toBe('6/29/2021');
});

test('format_plural() returns pluralized words', () => {
    const word = 'Tiger';
    let number = 2;

    expect(format_plural(word, number)).toBe('Tigers');

    number = 1;
    expect(format_plural(word, number)).toBe('Tiger');
});

test('format_url() returns shortened URL', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');
  
    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');

});