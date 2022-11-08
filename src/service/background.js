chrome.runtime.onInstalled.addListener(() => {
    setTheme("auto", null)
});

function handleMessage(request, sender, sendResponse) {
    if(request.from === 'popup'){
        setTheme(request.theme, sendResponse)
    }

    if(request.from === 'content'){

        let theme = getTheme();
        Promise.all([theme]).then(values => {
            console.log("Sending theme to content : " + values[0])
            sendResponse({"theme" : values[0]})
        })

        return true;
    }
    console.log(request)
}
function setTheme(theme, response){
    chrome.storage.sync.set({"theme":theme}, ()=>{
        console.log(`Theme updated to ${theme}`)
        if(response){
            response(`Theme updated to ${theme}`)
        }
    })
}

async function getTheme(){
    let key = "theme"
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function (result) {
            if (result[key] === undefined) {
                reject();
            } else {
                resolve(result[key]);
            }
        });
    });
}

chrome.runtime.onMessage.addListener(handleMessage);