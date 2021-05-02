/**
 * calls ask method on convo
 * @param entity
 * @param question
 * @returns {Promise<>}
 */
function ask(entity, question) {
    return new Promise(((resolve) => {
        entity.ask(question, (payload) => {
            resolve(payload)
        })
    }))
}

module.exports = {
    ask
}