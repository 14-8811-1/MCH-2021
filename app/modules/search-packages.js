const {isValid} = require("../helpers/validation-helper");
const {convoAsk} = require("../helpers/bot-helper");
const {dataListFetch} = require("../api/npms-api");

module.exports = (bot) => {
    const conversation = async (convo) => {
        await questions.askQuery(convo);
        await questions.askAllowInsecure(convo, ["yes", "no"]);
        await questions.askAllowUnstable(convo, ["yes", "no"]);
        await questions.AskLimit(convo, ["1", "2", "3", "4", "5"])

        let query = convo.get("query");
        let allowUnstable = convo.get("allowUnstable");
        let allowInsecure = convo.get("allowInsecure");
        let limit = convo.get("limit");

        await convo.say(`Ok, here's what you told me:
	      - query: ${query}
	      - allow unstable modules: ${allowUnstable ? "yes" : "no"}
	      - allow insecure modules: ${allowInsecure ? "yes" : "no"}
	      - How many results should be listed: ${limit}
	      `);

        await convo.say(`Now give me a moment to find what you are looking for :)`);
        let results = await dataListFetch({
            query, allowUnstable, allowInsecure
        }, limit);

        if (Array.isArray(results) && results.length > 0) {
            await convo.say("here is what I have found:");
            for (let i = 0; i < results.length; i+= 1) {
                let result = results[i];
                let {name, description, keywords} = result.package;
                let finalScore = result.score.final;

                await convo.say(`${name}
	      - Desc: ${description}
	      - Keywords: ${Array.isArray(keywords) ? keywords.join(", ") : ""}
	      - Score: ${finalScore}`);
            }

        } else {
            await convo.say("unfortunately no module meets the requirements.");
        }

        convo.end();
    }

    bot.hear("search modules", (payload, chat) => {
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

    // const conversation = async (convo) => {
    //     const validNames = ['Red', 'Green', 'Blue'];
    //     await questions.askName(convo, validNames);
    //     await questions.askFood(convo);
    //
    //     await convo.say(`Ok, here's what you told me about you:
    //       - Name: ${convo.get("name")}
    //       - Favorite Food: ${convo.get("food")}`);
    //     convo.end();
    // }

    // bot.hear("ask name", (payload, chat) => {
    //     chat.conversation(async (convo) => {
    //         try {
    //             await conversation(convo);
    //         } catch (e) {
    //             console.error(e);
    //             await convo.say(`Oops, something went wrong :(`)
    //             await convo.say(`Try again later`)
    //             convo.end();
    //         }
    //     });
    // });
}


const questions = {
    askQuery: async (convo) => {
        let response = await convoAsk(convo, "Describe what you are looking for in few words (1-5 words)");
        let query = response.message.text;
        if (query === "end conversation") {
            await convo.say(`End of the conversation.`)
            convo.end();
        }

        convo.set("query", query);
    },
    askAllowUnstable: async (convo, validBoolValues) => {
        let response = await convoAsk(convo, {
            text: "Allow also unstable modules? (yes/no)",
            quickReplies: validBoolValues
        });
        let allowUnstable = response.message.text;
        if (allowUnstable === "end conversation") {
            await convo.say(`End of the conversation.`)
            convo.end();
        } else if (!isValid(allowUnstable, validBoolValues)) {
            await convo.say(`Invalid input, try again or type 'end conversation' to end the conversation.`)
            await questions.askAllowUnstable(convo, validBoolValues);
        }

        allowUnstable = allowUnstable === "yes";
        convo.set("allowUnstable", allowUnstable);
    },
    askAllowInsecure: async (convo, validBoolValues) => {
        let response = await convoAsk(convo, {
            text: "Allow also insecure modules? (yes/no)",
            quickReplies: validBoolValues
        });
        let allowInsecure = response.message.text;
        if (allowInsecure === "end conversation") {
            await convo.say(`End of the conversation.`)
            convo.end();
        } else if (!isValid(allowInsecure, validBoolValues)) {
            await convo.say(`Invalid input, try again or type 'end conversation' to end the conversation.`)
            await questions.askAllowInsecure(convo, validBoolValues);
        }

        allowInsecure = allowInsecure === "yes";
        convo.set("allowInsecure", allowInsecure);
    },
    AskLimit: async (convo, validLimitValues) => {
        let response = await convoAsk(convo, {
            text: "how many modules do you want to be listed? (1-3)",
            quickReplies: validLimitValues
        });
        let limit = response.message.text;
        if (limit === "end conversation") {
            await convo.say(`End of the conversation`)
            convo.end();
        } else if (!isValid(limit, validLimitValues)) {
            await convo.say(`Invalid input, try again or type 'end conversation' to end the conversation`)
            await questions.AskLimit(convo, Number(validLimitValues));
        }

        convo.set("limit", limit);
    },

    // askName: async (convo, validNames) => {
    //     let response = await convoAsk(convo, {text: "What is your name?", quickReplies: validNames});
    //     let userName = response.message.text;
    //     if (userName === "end conversation") {
    //         await convo.say(`End of the conversation`)
    //         convo.end();
    //     }
    //     if (!isValid(userName, validNames)) {
    //         await convo.say(`Invalid input, try again or type 'end conversation' to end the conversation`)
    //         await questions.askName(convo, validNames);
    //     }
    //
    //     convo.set("name", userName);
    //     // await convo.say(`Ok, your name is ${userName}`)
    //     // return userName;
    // },
    // askFood: async (convo) => {
    //     let response = await convoAsk(convo,  "What's your favorite food?");
    //     let userFood = response.message.text;
    //     if (userFood === "end conversation") {
    //         await convo.say(`End of the conversation`)
    //         convo.end();
    //     }
    //
    //     convo.set("food", userFood);
    //     // await convo.say(`Got it, your favorite food is ${userFood}`)
    //     // return userFood;
    // }
}

