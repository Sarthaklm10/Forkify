import { TIMEOUT_SECONDS } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const getJSON = async function (url) {
    try {
        
        const promises = [fetch(url), timeout(TIMEOUT_SECONDS)];
        const res = await Promise.race(promises);
        const data = await res.json();

        if (!res.ok)
            throw new Error(`${data.message}${res.status}`);

        return data;
    }
    catch (err) {
        throw err;
    }
}