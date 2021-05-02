const fetch = require("node-fetch");

/**
 * API docs: https://api-docs.npms.io
 */
const NPMS_API = "https://api.npms.io/v2/";

/**
 * Used to search modules according to params
 * @param query
 * @param allowUnstable
 * @param allowInsecure
 * @param limit
 * @returns {Promise<>}
 */
async function dataListFetch({query = "", allowUnstable = false, allowInsecure = false }, limit = 5) {
    let url = NPMS_API + "search?q=" + encodeURI(query)
    url = allowUnstable ? url : url + "+not:deprecated"
    url = allowInsecure ? url : url + "+not:insecure"
    url = url + "&size=" + limit

    let response = await _performFetch(url);
    return response.results;
}

/**
 * Used to load data of exact module
 * @param name
 * @returns {Promise<>}
 */
async function dataObjectFetch(name) {
    let url = NPMS_API + "package/" + name;
    return _performFetch(url);
}

/**
 * perform the fetch to specific url
 * throws error if the status code is not 2xx
 * @param url
 * @returns {Promise<>}
 * @private
 */
async function _performFetch(url) {
    let data = await fetch(url);
    let results = [];
    if (data.status >= 200 && data.status < 300) {
        let response;
        try {
            response = await data.json();
            results = response;
        } catch (e) {
            throw new Error("Unable to parse response.");
        }
    } else {
        throw new Error("Unable to load data.");
    }

    return results;
}

module.exports = {
    dataListFetch,
    dataObjectFetch
}