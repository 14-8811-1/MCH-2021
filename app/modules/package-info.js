const {isValid} = require("../helpers/validation-helper");
const {ask} = require("../helpers/bot-helper");
const {dataObjectFetch, dataListFetch} = require("../api/npms-api");

/**
 * Conversation to load basic info about exact module
 * If the exact module is not found, it performs the search for modules with
 * similar name and ask the user if it what he was looking for, but only in case
 * that it found a module
 *
 */
const bModule = {
    keywords: ["module info"],
    botModule: (bot) => {
        const conversation = async (convo) => {
            await questions.askName(convo);
            let name = convo.get("name");

            await convo.say(`Ok, here's what you told me:
	      - module name: ${name}`);

            await convo.say(`Now give me a moment to find what you are looking for :)`);

            let result;
            try {
                result = await dataObjectFetch(name);
            } catch (e) {
                await convo.say(`A module with name ${name} does not exist.`);
            }


            if (result) {
                await convo.say("here is what I have found:");
                let { name, description, version, links, license } = result.collected.metadata;
                let finalScore = result.score.final;

                await convo.say(`${name}
              - Desc: ${description}
              - version: ${version}
              - Score: ${finalScore}
              - License: ${license}
              - Link: ${links.npm}
              `);
            } else {
                let results = await dataListFetch({
                    query: name
                }, 1);

                if (Array.isArray(results) && results.length === 1) {
                    let listResult = results[0];
                    let { name, description, keywords, links, license } = listResult.package;
                    let finalScore = listResult.score.final;

                    await questions.askShowFromSearch(convo, name, ["yes", "no"])

                    if (convo.get("showFromSearch")) {
                        await convo.say("here is what I have found:");
                        await convo.say(`${name}
              - Desc: ${description}
              - Keywords: ${Array.isArray(keywords) ? keywords.join(", ") : ""}
              - Score: ${finalScore}
              - License: ${license}
              - Link: ${links.npm}
              `);
                    }
                }
            }

            await convo.say(`End of the conversation.`)
            convo.end();
        }

        bot.hear(bModule.keywords, (payload, chat) => {
            chat.conversation(async (convo) => {
                try {
                    await conversation(convo);
                } catch (e) {
                    console.error(e);
                    await convo.say(`Oops, something went wrong :(`)
                    await convo.say(`Try again later`)
                    convo.end();
                }
            });
        });
    }
}

const questions = {
    askName: async (convo) => {
        let response = await ask(convo, "What module are you looking for?");
        let name = response.message.text.toLowerCase();
        if (name === "end conversation") {
            await convo.say(`End of the conversation.`)
            convo.end();
        } else {
            convo.set("name", name);
        }
    },
    askShowFromSearch: async (convo, name, validBoolValues) => {
        let response = await ask(convo, {
            text: `didn't you mean ${name}? (yes/no)`,
            quickReplies: validBoolValues
        });
        let showFromSearch = response.message.text.toLowerCase();
        if (showFromSearch === "end conversation") {
            await convo.say(`End of the conversation.`)
            convo.end();
        } else if (!isValid(showFromSearch, validBoolValues)) {
            await convo.say(`Invalid input, try again or type 'end conversation' to end the conversation.`)
            await questions.askShowFromSearch(convo, validBoolValues);
        } else {
            showFromSearch = showFromSearch === "yes";
            convo.set("showFromSearch", showFromSearch);
        }
    },
}

module.exports = bModule;