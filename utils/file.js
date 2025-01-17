const fs = require("fs").promises;
const { logger } = require("./logger");
const TOKEN_FILE = "tokenz.json";

// Function to save the token
async function saveToken(data) {
    try {
        let tokens = [];
        try {
            const fileData = await fs.readFile(TOKEN_FILE, 'utf8');
            tokens = JSON.parse(fileData);
        } catch (error) {
            logger("No previous tokens found.", "error");
        }

        const tokenIndex = tokens.findIndex(token => token.username === data.username);

        if (tokenIndex !== -1) {
            tokens[tokenIndex] = data;
            logger(`Token for ${data.username} updated.`);
        } else {
            tokens.push(data);
            logger(`Token for ${data.username} added.`);
        }

        await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2));
        logger('Token saved successfully!', "success");

    } catch (error) {
        logger('Error saving token:', "error", error);
    }
}


// Function to read all saved tokens
async function readToken() {
    try {
        const data = await fs.readFile(TOKEN_FILE, "utf8");
        return JSON.parse(data);
    } catch {
        logger("No tokens found. Please login first.", "error");
        process.exit(1);
    }
}

async function loadProxies() {
    try {
        const data = await fs.readFile('proxy.txt', 'utf8');
        return data.split('\n').filter(proxy => proxy.trim() !== '');
    } catch (error) {
        logger('Error reading proxy file:', "error", error);
        return [];
    }
}

const headers = {
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "en-US,en;q=0.9",
    "priority": "u=1, i",
    "sec-ch-ua": '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "none",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.58 Safari/537.36"
}
module.exports = { saveToken, readToken, loadProxies, headers };
