/**
 * calls ask method on convo
 * @param convo
 * @param question
 * @returns {Promise<>}
 */
function convoAsk(convo, question) {
    return new Promise(((resolve) => {
        convo.ask(question, (payload) => {
            resolve(payload)
        })
    }))
}

module.exports = {
    convoAsk
}