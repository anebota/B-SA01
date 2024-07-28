let speech = new SpeechSynthesisUtterance();

document.querySelector("button").addEventListener("click", () => {
    paragraphs = document.querySelectorAll("p");
    speech.text = paragraphs[0].textContent;
    window.speechSynthesis.speak(speech);
})