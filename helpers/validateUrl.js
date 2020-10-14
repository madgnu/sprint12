/**
 * @module
 * @description Helps with URL pattern validation
 */
module.exports = (url) => /^http[s]?:\/\/(www\.)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|([a-z0-9-]+\.)+[a-z]{2,5})(:\d{2,5})?(\/[a-zA-Z0-9\-./?=&_]*(#[a-zA-Z0-9]*)?)?$/.test(url);
