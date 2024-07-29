let speech = new SpeechSynthesisUtterance();

document.querySelector("#play").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    section = document.querySelector(".active").getAttribute("data-index");
    console.log(section);
    titles = document.querySelectorAll("h2");
    paragraphs = document.querySelectorAll("p");
    speech.text = removeTags(titles[section].innerHTML + ": " + paragraphs[section].innerHTML);
    console.log(speech.text);
    window.speechSynthesis.speak(speech);
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