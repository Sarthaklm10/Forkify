import { TIMEOUT_SECONDS } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async function (url, uploadData = undefined) {
    try {
        const myFetch = uploadData ? 
            fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(uploadData),
            }) 
            : fetch(url);

        const res = await Promise.race([myFetch, timeout(TIMEOUT_SECONDS)]);
        const data = await res.json();
        if (!res.ok)
            throw new Error(`${data.message}${res.status}`);
        return data;
    }
    catch (err) {
        throw err;
    }
}

// export const getJSON = async function (url) {
    
// }

// export const sendJSON = async function (url, uploadData) {

// }