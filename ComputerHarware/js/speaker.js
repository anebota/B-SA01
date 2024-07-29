let speech = new SpeechSynthesisUtterance();


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
    console.log("auto: "+autoplay);
    if (autoplay) {
        playSection(-1);
    }
})

document.querySelector("#next").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    autoplay = document.querySelector("#auto").checked;
    console.log("auto: "+autoplay);
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
    let section = parseInt(document.querySelector(".active").getAttribute("data-index"))-1+parseInt(offset);
    let titles = document.querySelectorAll("h2");
    let paragraphs = document.querySelectorAll("p");
    let next = paragraphs[section].nextElementSibling;
    let listitems = next.querySelectorAll("li");
    let length = listitems.length;
    let list = ""

    if (section == -1) {
        section = titles.length;    
    }
    if (section == 13) {
        section = 0;    
    }
    console.log("index: "+section);
    console.log(listitems.length);
    listitems.forEach(item => list += item.innerHTML + "; ");
    speech.text = (titles[section].innerHTML + ": " + paragraphs[section].innerHTML + " " + list);
    console.log(speech.text);
    window.speechSynthesis.speak(speech);
}