let speech = new SpeechSynthesisUtterance();

let voices = [];

let voiceSelect = document.querySelector("#voices")

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];

    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
}

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
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
    autoplay = document.querySelector("#auto").checked;
    if (autoplay) {
        playSection(-1);
    }
})

document.querySelector("#next").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    autoplay = document.querySelector("#auto").checked;
    if (autoplay) {
        playSection(1);
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
    return str.replace(/(<([^>]+)>)/ig, '');
}

function playSection(offset) {
    let section = parseInt(document.querySelector(".active").getAttribute("data-index"))+parseInt(offset)-1;
    console.log("index: "+section);
    let titles = document.querySelectorAll("h2");
    let paragraphs = document.querySelectorAll("p");
    let length = parseInt(titles.length);
    console.log("header: "+length);
    if (section < 0) {
        section = length-1;    
    }
    if (section > (length-1)) {
        section = 0;    
    }
    console.log("new index: "+section);
    let next = paragraphs[section].nextElementSibling;
    let listitems = next.querySelectorAll("li");
    let list = ""
    listitems.forEach(item => list += item.innerHTML + "; ");
    speech.text = (titles[section].innerHTML + ": " + paragraphs[section].innerHTML + " " + list);
    console.log(speech.text);
    window.location.replace('#section'+parseInt(section+1));
    console.log('#section'+parseInt(section+1));
    window.speechSynthesis.speak(speech);
}