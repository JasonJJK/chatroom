const serverAddress = "http://localhost:3000"

const chatLogs = document.getElementById("chatLogs")
const chatBox = document.getElementById("chatBox")
const chatBtn = document.getElementById("chatBtn")
const nameBox = document.getElementById("nameBox")

let lastSender = ""

// al opgehaalde berichten
let bestaandeBerichten = []


// definitieve render van bericht.
function verzendChat(arr){  
    const newLogDiv = document.createElement("div")
    newLogDiv.classList.add("newLogDiv")


    const naam = document.createElement("p")
    naam.classList.add("naam")
    naam.innerHTML = arr.username

    const tijd = document.createElement("p")
    tijd.classList.add("tijd")
    tijd.innerHTML = arr.time
    
    const bericht = document.createElement("p")
    bericht.classList.add("bericht")
    bericht.innerHTML = arr.message


    if (lastSender != arr.username)
    {
        newLogDiv.appendChild(naam)
        newLogDiv.appendChild(tijd)
    }
    else
    {
        newLogDiv.style.marginTop = "5px"
    }


    newLogDiv.appendChild(bericht)

    chatLogs.appendChild(newLogDiv)
    chatLogs.scrollTo(0, chatLogs.scrollHeight)

    lastSender = arr.username
}



// tijd ophaal functie (was blijkbaar niet nodig)
function getTime(){
    let now = new Date();
    let mins = now.getMinutes()
    if (mins < 10) {
        mins = "0" + mins
    }
    return now.getHours() + ":" + mins
}



// newChat vanaf client send
function newChat(){
    if (chatBox.value != "")
    {
        let arr = {
            username: document.getElementById("nameBox").value,
            message: chatBox.value,
            time: getTime(),
        }

        fetch(serverAddress + "/send", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(arr),
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
        });

        verzendChat(arr)
        bestaandeBerichten.push(arr)
        chatBox.value = ""
    }
}



// newChat op Enter click
chatBox.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        newChat();
    }
});




// eerste keer ophalen van berichten
fetch(serverAddress + "/messages", {method: "GET"})
.then((response) => response.json())
    .then((response) => {
        response.forEach(arr => {
            verzendChat(arr)
            bestaandeBerichten.push(arr)
        });
    })
    .catch((err) => {
        console.log(err);
    });



// verversing van berichten elke seconde
setInterval(function() {
    let clientLength = bestaandeBerichten.length
    
    fetch(serverAddress + "/messages", {method: "GET"})
        .then((response) => response.json())
        .then((response) => {
            for (let i=clientLength; i<response.length; i++)
            {
                verzendChat(response[i])
                bestaandeBerichten.push(response[i])
            }
        })
        .catch((err) => {
            console.log(err);
        });

} ,1000)