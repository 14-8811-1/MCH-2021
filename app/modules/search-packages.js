const {isValid} = require("../helpers/validation-helper");
const {convoAsk} = require("../helpers/bot-helper");

module.exports = (bot) => {
    const conversation = async (convo) => {
        const validNames = ['Red', 'Green', 'Blue'];
        await questions.askName(convo, validNames);
        await questions.askFood(convo);

        await convo.say(`Ok, here's what you told me about you:
	      - Name: ${convo.get("name")}
	      - Favorite Food: ${convo.get("food")}`);
        convo.end();
    }


    bot.hear("ask name", (payload, chat) => {
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



const questions = {
    askName: async (convo, validNames) => {
        let response = await convoAsk(convo, {text: "What is your name?", quickReplies: validNames});
        let userName = response.message.text;
        if (userName === "end conversation") {
            await convo.say(`End of the conversation`)
            convo.end();
        }
        if (!isValid(userName, validNames)) {
            await convo.say(`Invalid input, try again or type 'end conversation' to end the conversation`)
            await questions.askName(convo, validNames);
        }

        convo.set("name", userName);
        // await convo.say(`Ok, your name is ${userName}`)
        // return userName;
    },
    askFood: async (convo) => {
        let response = await convoAsk(convo,  "What's your favorite food?");
        let userFood = response.message.text;
        if (userFood === "end conversation") {
            await convo.say(`End of the conversation`)
            convo.end();
        }

        convo.set("food", userFood);
        // await convo.say(`Got it, your favorite food is ${userFood}`)
        // return userFood;
    }
}

