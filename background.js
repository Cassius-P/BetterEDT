
let theme = 'auto';
function handleMessage(request, sender, sendResponse) {
    if(request.from === 'popup'){
        theme = request.theme
    }

    if(request.from === 'content'){
        sendResponse({ theme });
    }
    console.log(request)
    console.log({theme})

}

chrome.runtime.onMessage.addListener(handleMessage);