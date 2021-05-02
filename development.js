const nodemon = require("nodemon");
const ngrok = require("ngrok");
const config = require("config");

const BOT_PORT = config.get("PORT") || 8007;
// const BOT_TUNNEL_SUBDOMAIN = config.get("botTunnelSubDomain") || "";
const VERIFY_TOKEN = config.get("VERIFY_TOKEN");

const SCRIPT_INDEX = "./index.js";

const mon = nodemon({
    script: SCRIPT_INDEX
});

async function main() {
    let connection;
    try {
        connection = await ngrok.connect({
            addr: BOT_PORT,
            onStatusChange: status => {
                if (status === "closed") {
                    console.log(`\nTunnel closed`)
                }
            },
        });
    } catch (e) {
        console.error(e);
    }
    let {url} = connection;
    startupLog({url, VERIFY_TOKEN})
}

process.once("SIGINT", function () {
    ngrok.disconnect().then();
    console.log(`BootBot server closed`);
    process.exit(0);
});

function startupLog({url, VERIFY_TOKEN}) {
    console.log(`
     ____    ___    ___   ______  ____    ___   ______
    |    \\  /   \\  /   \\ |      T|    \\  /   \\ |      T
    |  o  )Y     YY     Y|      ||  o  )Y     Y|      |
    |     T|  O  ||  O  |l_j  l_j|     T|  O  |l_j  l_j
    |  O  ||     ||     |  |  |  |  O  ||     |  |  |
    |     |l     !l     !  |  |  |     |l     !  |  |
    l_____j \\___/  \\___/   l__j  l_____j \\___/   l__j
    `);
    console.log(`
    Local Bot running on: ${url}
    Configure your Facebook App's Webhook with:
    Webhook URL: ${url}/webhook
    Verify Token: ${VERIFY_TOKEN}
    Press Ctrl + C to stop.
    `);
}