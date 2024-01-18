let lastDonator = "";
let newdonor = "";

function update_data(RequestUrl, schoolname) {
    let jsondata = `{
    "schoolName": "${schoolname}"
    }`;
    $.ajax({
        type: 'POST',
        method: 'POST',
        data: jsondata,
        dataType: 'json',
        url: RequestUrl,
        contentType: "application/json; charset=utf-8",
        timeout: 20000,
    }).always((response) => {
        if (response.status == "success") {
            let classment_name = ''
            let classment_percentage = ''

            for (let i = 0; i < response.classment.length; i++) {
                classment_name += `
                <div>
                    <label>${response.classment[i].displayName}</label>
                    <p>${response.classment[i].cityDisplayName}</p>
                </div>`
                classment_percentage += `
                <p>${Math.round(response.classment[i].globalScore)}%</p>
                `
            }

            if (lastDonator != response.data.lastDonator) {
                newdonor = createMessage(response.data.lastDonator);
                showMessage(newdonor);
            }
            lastDonator = response.data.lastDonator;
            document.getElementById("classment_school").innerHTML = classment_name;
            document.getElementById("classment_percentage").innerHTML = classment_percentage;
            document.getElementById("school_percentage").innerHTML = Math.round(response.data.globalScore) + "%";
            document.getElementById("qr_code_elem").src = response.data.qrcodeurl;
            
        }
    })
    setTimeout(function () {
        update_data(RequestUrl, schoolname);
    }, 100);
}

function createMessage(message_text) {
    console.log(message);
    var message = document.createElement("div");
    message.className = "message";
    message.innerHTML = message_text;
    document.body.appendChild(message);
    return message;
}


function fadeIn(element, duration) {
    var start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = (timestamp - start) / duration;
        element.style.opacity = Math.min(progress, 1);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

// Hide the message with progressive fadeOut animation
function fadeOut(element, duration) {
    var start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = (timestamp - start) / duration;
        element.style.opacity = 1 - Math.min(progress, 1);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

// Set a random position for the message
function setRandomPosition(element) {
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;

    var randomX = Math.floor(Math.random() * (screenWidth - 900));
    var randomY = Math.floor(Math.random() * (screenHeight - 300));

    element.style.left = randomX + "px";
    element.style.top = randomY + "px";
}

// Show the message and set a timeout to hide it after a few seconds
function showMessage(message) {
    
    setRandomPosition(message);
    message.style.display = "block";
    fadeIn(message, 1000); // Adjust the duration (in milliseconds) as needed

        setTimeout(function () {
            fadeOut(message, 1000); // Adjust the duration (in milliseconds) as needed
            setTimeout(function () {
                message.style.display = "none";
            }, 1000); // Adjust the duration (in milliseconds) as needed
        }, 3000); // Adjust the duration (in milliseconds) as needed
}