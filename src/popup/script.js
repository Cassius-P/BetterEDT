let auto = document.querySelector("#auto");
let select = document.querySelector("#select");

let storage = localStorage;
let theme = storage.getItem('edtTheme');

auto.addEventListener('change', (event) => {
    listener('auto', event)
})
select.addEventListener('change', (event) => {
    listener('select', event)
})

function listener(input, event) {
    let value = null;
    if(input === 'auto' && auto.checked){
        value = 'auto'
    }
    if(input === 'auto' && !auto.checked) {
        value = select.value;
    }

    if(input === 'select'){
        value = event.target.value;
    }
    updateTheme(value);
}


function updateTheme(wanted) {

    if(wanted == null) {
        wanted = getStorageTheme();
    }
    sendData(wanted)
    setStorageTheme(wanted)
    setInputs(wanted)

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

function setInputs(value) {
    if(value === 'auto'){
        auto.checked = true;
        select.disabled = true;
    }
    if(value === 'light' || value === 'dark'){
        auto.checked = false;
        select.disabled = false;
        select.value = value
    }
}

function setStorageTheme(theme){
    storage.setItem('edtTheme', theme)
}

function getStorageTheme(){
    let theme = storage.getItem('edtTheme')
    if(theme == null ) {
        setStorageTheme('auto')
        theme = storage.getItem('edtTheme')
    }
    return theme;
}

function sendData(theme){
    let msg = {
        from: 'popup',
        theme
    }
    chrome.tabs.query({}, function(tabs) {
        const i = tabs.findIndex(e => e.url.includes('https://ws-edt-cd.wigorservices.net/'));
        console.log("Tab at index " +i )
        if (i > -1) {
            chrome.tabs.sendMessage(tabs[i].id, msg);
        }
        return
    });
    chrome.runtime.sendMessage(msg)
}

updateTheme(null);