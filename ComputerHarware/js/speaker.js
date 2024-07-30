let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("#voices")
let max = parseInt(document.querySelectorAll("h2").length)-1;
let autoplay = true;
let interval = 100/max;

console.log("max: "+(max)+" Interval: "+interval);
console.log("autoplay: "+autoplay);

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];

    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
}

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
})

document.querySelector("#auto").addEventListener("change", () => {
    autoplay = document.querySelector("#auto").checked;
    console.log("autoplay: "+autoplay);
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
    let section = parseInt(document.querySelector(".active").getAttribute("data-index"))-2;
    if (section < 0) {
        section = (max);    
    }
    if (section > (max)) {
        section = 0;    
    }    
    let progress = Math.ceil((interval)*(section));
    console.log("progress: "+progress+"%");
    document.querySelector("#progress").innerHTML = progress+"%";
    if (section == 0) {
        document.querySelector("#progress").style = "width: 5%;";    
    } else {
        document.querySelector("#progress").style = "width: "+progress+"%;";    
    }
    console.log('#section'+parseInt(section));
    scrollSmoothTo('section'+parseInt(section+1));
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
    } else {
        document.querySelector("#next").classList.remove("disabled");
    }        
})

document.querySelector("#next").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    let section = parseInt(document.querySelector(".active").getAttribute("data-index"));
    if (section < 0) {
        section = (max);    
    }
    if (section > (max)) {
        section = 0;    
    }    
    let progress = Math.ceil((interval)*(section));
    console.log("progress: "+progress+"%");
    document.querySelector("#progress").innerHTML = progress+"%";
    if (section == 0) {
        document.querySelector("#progress").style = "width: 5%;";    
    } else {
        document.querySelector("#progress").style = "width: "+progress+"%;";    
    }
    console.log('#section'+parseInt(section));
    scrollSmoothTo('section'+parseInt(section+1));
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
    return str.replace(/(<([^>]+)>)/ig, '');
}

function scrollSmoothTo(elementId) {
    var element = document.getElementById(elementId);
    element.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
  }

function playSection(offset) {
    let section = parseInt(document.querySelector(".active").getAttribute("data-index"))+parseInt(offset)-1;
    console.log("index: "+section);
    let titles = document.querySelectorAll("h2");
    let paragraphs = document.querySelectorAll("p");
    let length = parseInt(titles.length);
    console.log("header: "+length);
    if (section < 0) {
        section = (max);    
    }
    if (section > (max)) {
        section = 0;    
    }
    console.log("new index: "+section);
    let next = paragraphs[section].nextElementSibling;
    let listitems = next.querySelectorAll("li");
    let list = ""
    listitems.forEach(item => list += item.innerHTML + "; ");
    speech.text = (titles[section].innerHTML + ": " + paragraphs[section].innerHTML + " " + list);
    window.speechSynthesis.speak(speech);
}