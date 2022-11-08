
function handleResponse(message) {
    console.log(message);
    updateTheme(message)
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

 function notifyBackgroundPage() {
    console.log("Sending message to SW")
    chrome.runtime.sendMessage({
        from: 'content'
    },  (response) => {
         handleResponse(response)
    });
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

function placeMarker(inputDate){
    let marker = document.querySelector("#now");
    let months = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre")



    let date = inputDate == null ? new Date() : new Date(inputDate)

    console.log(`Marker updated at ${date}`)
    let month = months[date.getMonth()]
    let day = ("0" + date.getDate()).slice(-2);
    let Jours = document.querySelectorAll(".Jour");
    let jour = null;
    for(let i = 0; i < Jours.length; i++) {
        if(Jours[i].textContent.includes(day + " " + month)) {
            jour = Jours[i];
            break;
        }
    }
    if(jour == null) {
        return;
    }

    if(date.getHours() < 8 || date.getHours() >= 20 ){
        marker != null ? marker.remove() : "";
        return;
    }

    //Percentage for CSS top and left
    let leftInPercent = jour.style.left;
    let topInPercent = calculateTop(date.getHours(), ("0" + date.getMinutes()).slice(-2));

    if(marker == null) {
        let c = document.querySelector("#DivBody")
        marker = document.createElement("div");
        marker.id = "now"
        marker.style.left = leftInPercent;
        marker.style.top = topInPercent;

        c.appendChild(marker)
        marker = document.querySelector("#now")
    }
    marker.style.left = leftInPercent;
    marker.style.top = topInPercent;
}
function calculateTop(hours, minutesWithLeadingZero){

    let step = 95 / 12
    let hoursPercent = 110 + ((hours - 8) * step)

    let minutesPercent = (minutesWithLeadingZero / 60) * step
    let result = hoursPercent + minutesPercent

    return result+"%";
}

notifyBackgroundPage()
placeMarker();

setInterval(() => {
    placeMarker();
}, 1000 * 60)


