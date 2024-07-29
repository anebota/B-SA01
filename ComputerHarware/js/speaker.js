let speech = new SpeechSynthesisUtterance();

document.querySelector("#play").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    section = document.querySelector(".active").getAttribute("data-index");
    console.log(section);
    titles = document.querySelectorAll("h2");
    paragraphs = document.querySelectorAll("p");
    next = paragraphs[section].nextElementSibling;
    listitems = next.querySelectorAll("li");
    length = listitems.length;
    console.log(listitems.length);
    list = ""
    listitems.forEach(item => list += item.innerHTML + "; ");
    speech.text = (titles[section].innerHTML + ": " + paragraphs[section].innerHTML + " " + list);
    console.log(speech.text);
    window.speechSynthesis.speak(speech);
})

document.querySelectorAll(".carousel-icon").forEach(button => 
  button.addEventListener("click", () => window.speechSynthesis.cancel())
)

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

