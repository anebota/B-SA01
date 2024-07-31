let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("#voices")
let max = parseInt(document.querySelectorAll("section h2").length) - 1;
let autoplay = true;
let interval = 100 / max;
let debug = true;
let defaultvoice = 2;
//let mysection = sessionStorage.getItem("section");

if (debug) console.log("max: " + (max) + " Interval: " + interval);
if (debug) console.log("autoplay: " + autoplay);

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
    speech.voice = voices[defaultvoice];
    voiceSelect.value = defaultvoice;
}

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
})

document.querySelector("#auto").addEventListener("change", () => {
    autoplay = document.querySelector("#auto").checked;
    if (debug) console.log("autoplay: " + autoplay);
})

document.querySelector("#play").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    playSection(0);
})

document.querySelector("#stop").addEventListener("click", () => {
    window.speechSynthesis.cancel();
})

document.querySelector("#prev").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    let section = parseInt(document.querySelector(".carousel-item.active").getAttribute("data-index")) - 2;
    if (section < 0) {
        section = (max);
    }
    if (section > (max)) {
        section = 0;
    }
    let progress = Math.ceil((interval) * (section));
    if (debug) console.log("progress: " + progress + "%");
    document.querySelector("#progress").innerHTML = progress + "%";
    if (section == 0) {
        document.querySelector("#progress").style = "width: 5%;";
    } else {
        document.querySelector("#progress").style = "width: " + progress + "%;";
    }
    if (debug) console.log('#section' + parseInt(section));
    scrollSmoothTo('section' + parseInt(section + 1));
    if (autoplay) {
        playSection(-1);
    }
    if (section == 0) {
        document.querySelector("#prev").classList.add("disabled");
    } else {
        document.querySelector("#prev").classList.remove("disabled");
    }
    if (section == max) {
        document.querySelector("#next").classList.add("disabled");
        document.querySelector("#quiz").classList.remove("disabled");
    } else {
        document.querySelector("#next").classList.remove("disabled");
    }
})

document.querySelector("#next").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    let section = parseInt(document.querySelector(".carousel-item.active").getAttribute("data-index"));
    if (section < 0) {
        section = (max);
    }
    if (section > (max)) {
        section = 0;
    }
    if (debug) console.log("index: " + (section));
    let progress = Math.ceil((interval) * (section));
    if (debug) console.log("progress: " + progress + "%");
    document.querySelector("#progress").innerHTML = progress + "%";
    if (section == 0) {
        document.querySelector("#progress").style = "width: 5%;";
    } else {
        document.querySelector("#progress").style = "width: " + progress + "%;";
    }
    if (debug) console.log('#section' + parseInt(section));
    scrollSmoothTo('section' + parseInt(section + 1));
    if (autoplay) {
        playSection(1);
    }
    if (section == 0) {
        document.querySelector("#prev").classList.add("disabled");
    } else {
        document.querySelector("#prev").classList.remove("disabled");
    }
    if (section == max) {
        document.querySelector("#next").classList.add("disabled");
        document.querySelector("#quiz").classList.remove("disabled");
    } else {
        document.querySelector("#next").classList.remove("disabled");
    }
})


function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/ig, '').trim();
}

function scrollSmoothTo(elementId) {
    var element = document.getElementById(elementId);
    element.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
    });
}

function playSection(offset) {
    let section = parseInt(document.querySelector(".carousel-item.active").getAttribute("data-index")) + parseInt(offset) - 1;
    if (debug) console.log("index: " + section);
    let titles = document.querySelectorAll("section h2");
    let paragraphs = document.querySelectorAll("section p");
    let length = parseInt(titles.length);
    if (debug) console.log("header: " + length);
    if (section < 0) {
        section = (max);
    }
    if (section > (max)) {
        section = 0;
    }
    if (debug) console.log("new index: " + section);
    let list = ""
    try {
        let next = paragraphs[section].nextElementSibling;
        let listitems = next.querySelectorAll("section li");
        listitems.forEach(item => list += item.innerHTML + "; ");
    } catch (err) {
        if (debug) console.log("no list");
    }
    speech.text = removeTags(titles[section].innerHTML + ": " + paragraphs[section].innerHTML + " " + list).replace(/\s+/g, " ");
    if (debug) console.log("read text:"+speech.text);
    window.speechSynthesis.speak(speech);
}