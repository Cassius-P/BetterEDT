
function handleResponse(message) {
    console.log(message);
    updateTheme(message)
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function notifyBackgroundPage() {
    const sending = chrome.runtime.sendMessage({
        from: 'content'
    });
    sending.then(handleResponse, handleError);
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        handleResponse(request)
    }
);


function updateTheme(theme){

    let wanted = theme.theme
    if(wanted === 'auto'){
        const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        if(userPrefersLight){
            wanted = "light";
        }
        if(userPrefersDark){
            wanted = "dark";
        }
        console.log("Update " + wanted)
    }

    toggleDarkMode(wanted)
}


function toggleDarkMode(wanted) {
    console.log("Toggling " + wanted + " mode")
    if(wanted === 'dark'){
        document.documentElement.classList.add('dark-mode')
    }

    if(wanted === 'light'){
        document.documentElement.classList.remove('dark-mode')
    }
}

notifyBackgroundPage()


