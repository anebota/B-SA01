let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("#voices")
let autoplay = false;
let view = "learn";
let currentSection = 1;
let currentQuestion = 1;
let prevLock = true;
let nextLock = false;
let max = 0;
let debug = true;
let defaultvoice = 2;
var lastId;

/*
let imported;

//let mysection = sessionStorage.getItem("section");
function fetchJSONData() {
    fetch("data/data.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            //if (debug) console.log("data: "+JSON.stringify(data));
            (imported = data);
        })
        .catch ((error) =>
        console.error("Unable to fetch data:", error));
    }
fetchJSONData();

if (debug) console.log("learn: "+JSON.stringify(imported));
*/

if (debug) console.log("autoplay: " + autoplay);

start();

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
    let index = 0;
    if (view == "learn") {
        index = currentSection - 1;
    } else {
        index = currentQuestion - 1;
        document.querySelector("#quizhint").innerHTML = "";
    }
    updateProcessBar(index);
    if (debug) console.log('#section' + parseInt(index + 1));
    scrollSmoothTo('section' + parseInt(index + 1));
    if (autoplay) {
        playSection(-1);
    }
    checkNav(index);
    showContent(index);
})

document.querySelector("#next").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    let index = 0;
    if (view == "learn") {
        index = currentSection + 1;
    } else {
        index = currentQuestion + 1;
        document.querySelector("#quizhint").innerHTML = "";
    }
    updateProcessBar(index);
    if (debug) console.log('#section' + parseInt(index));
    //scrollSmoothTo('section' + parseInt(index + 1));
    if (autoplay) {
        playSection(1);
    }
    checkNav(index);
    showContent(index);
})

function checkNav(index) {
    if (index == 1) {
        prevLock = true;
    } else {
        prevLock = false;
    }
    if (index == max) {
        nextLock = true;
    } else {
        nextLock = false;
    }
    if (view == "learn") {
        currentSection = index;
    } else {
        currentQuestion = index;
    }    
    learningComplete(index);
    updateNav();
}

function learningComplete(index) {
    if (index == max && view == "learn") {
        document.querySelector("#quiz").classList.remove("disabled");
    }
}

function updateNav() {
    if (prevLock) {
        document.querySelector("#prev").classList.add("disabled");
    } else {
        document.querySelector("#prev").classList.remove("disabled");
    }
    if (view == "learn") {
        if (nextLock) {
            document.querySelector("#next").classList.add("disabled");
        } else {
            document.querySelector("#next").classList.remove("disabled");
        }
    } else {
        console.log("next lock? " +nextLock + " next question? "+checkAnswerCorrect());
        if (nextLock) {
            document.querySelector("#next").classList.add("disabled");
        } else {
            if (checkAnswerCorrect()) {
                document.querySelector("#next").classList.add("disabled");
            } else {
                document.querySelector("#next").classList.remove("disabled");
            }
        }
    }
}

function checkAnswerCorrect(){
    return !document.querySelector("#q"+currentQuestion).classList.contains("right");
}

function showContent(index) {
    if (view == "learn") {
        document.querySelector(".carousel-item.active").classList.remove("active");
        document.querySelector("#slide" + parseInt(index)).classList.add("active");        
        document.querySelector(".learnsection.active").classList.remove("active");
        document.querySelector("#section" + parseInt(index)).classList.add("active");
        currentSection = parseInt(index);
        if (debug) console.log("current: section" + (currentSection));
    } else {
        document.querySelector(".questions.active").classList.remove("active");
        document.querySelector("#q" + parseInt(index)).classList.add("active");
        currentQuestion = parseInt(index);
        if (debug) console.log("current: question" + (currentQuestion));
        if (index == 3) {celebrate()}
    }
}

function start() {
    let index = 0;
    if (view == "learn") {
        index = currentSection;
        max = parseInt(document.querySelectorAll(".learn section h2").length);
    } else {
        index = currentQuestion;
        max = parseInt(document.querySelectorAll(".quiz section h3").length);
    }
    if (debug) console.log(view + " index: " + index + " max: " + max);
    checkNav(index);
    updateProcessBar(index);
    showContent(index);
}

function updateProcessBar(section) {
    let current = 0;
    if (view == "learn") {
        currentSection = section;
        current = currentSection;
    } else {
        currentQuestion = section;
        current = currentQuestion;
    }
    let interval = 100 / max;
    let progress = Math.ceil((interval) * (current));
    if (debug) console.log("max: " + (max) + " Interval: " + interval);
    if (debug) console.log("progress: " + progress + "%");
    document.querySelector("#progress").innerHTML = progress + "%";
    if (section == 0) {
        document.querySelector("#progress").style = "width: 5%;";
    } else {
        document.querySelector("#progress").style = "width: " + progress + "%;";
    }
}

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
    let section = 0;
    let titles = "";
    let paragraphs = "";
    if (view == "learn") {
        section = currentSection;
        titles = document.querySelectorAll("." + view + " section h2");
        paragraphs = document.querySelectorAll("." + view + " section p");
        if (debug) console.log("index: section" + (section));
    } else {
        section = currentQuestion;
        titles = document.querySelectorAll("." + view + " section h3");
        //paragraphs = document.querySelectorAll("." + view + ".questions.subject");
        if (debug) console.log("index: question" + (section));
    }
    let length = parseInt(titles.length);
    if (debug) console.log("header length: " + length + " current:" + section);
    let title = titles[section-1].innerHTML;
    let paragraph = "";
    let list = "";
    try {
        let next = [];
        if (view == "learn") {
            paragraph = paragraphs[section-1].innerHTML;
            next = paragraphs[section-1].nextElementSibling;
        } else {
            paragraph = "";
            next = document.querySelectorAll("." + view + " section.questions.active label span.subject");
            console.log("answer count: "+next.length);
        }
        let listitems = [];
        if (view == "learn") {
            listitems = next.querySelectorAll("." + view + " section li");
        } else {
            listitems = next;
        }
        listitems.forEach(item => list += item.innerHTML + "; ");
    } catch (err) {
        if (debug) console.log("no list");
    }
    speech.text = removeTags(title + ": " + paragraph + " " + list).replace(/\s+/g, " ");
    if (debug) console.log("read text:" + speech.text);
    window.speechSynthesis.speak(speech);
}

document.querySelector("#learn").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    if (debug) console.log("tab: learn section:" + currentSection);
    view = "learn";
    updateTab(view)
    updateProcessBar(currentSection);
    checkNav(currentSection);
})

document.querySelector("#quiz").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    if (debug) console.log("tab: quiz section:" + currentQuestion);
    view = "quiz";
    updateTab(view)
    updateProcessBar(currentQuestion);
    checkNav(currentQuestion);
})

function updateTab(view) {
    if (view == "quiz") {
        document.querySelector(".learn").classList.add("hide");
        document.querySelector(".quiz").classList.remove("hide");
        document.querySelector("#quiz").classList.add("active");
        document.querySelector("#learn").classList.remove("active");
    } else {
        document.querySelector(".quiz").classList.add("hide");
        document.querySelector(".learn").classList.remove("hide");
        document.querySelector("#learn").classList.add("active");
        document.querySelector("#quiz").classList.remove("active");
    }
    start();
}

document.querySelectorAll(".quizbutton").forEach(quizbutton => {
    let id = quizbutton.id.slice(0, -1);
    //if (debug) console.log('question' + id);
    quizbutton.addEventListener("click", () => {
        for (let i = 1; i <= 4; i++) {
            let answer = document.querySelector("#" + id + "-" + i);
            //if (debug) console.log("correct answer: " + answer.classList.contains("correct"));
            if ((answer.checked == true) && (answer.classList.contains("correct"))) {
                document.querySelector("#quizhint").innerHTML = "<h4>Result:</h><br/><br/><p>That is the correct answer.</p><p>Please click on the next button in the navigation controls at the bottom left of your screen, to proceed.</p>";
                document.querySelector("label." + id + "-" + i).classList.add("right");
                document.querySelector("#" + id).classList.add("right");
            }
            if ((answer.checked == true) && (answer.classList.contains("incorrect"))) {
                document.querySelector("#quizhint").innerHTML = "<h4>Result:</h><br/><br/><p>Unfortunately, that is not the correct answer.</p><p>Please click on the Learning Material tab on the top right of your screen, to review the material for better insights.</p>";
                document.querySelector("label." + id + "-" + i).classList.add("wrong");
                document.querySelector("#" + id).classList.remove("right");
            }
            updateNav();
        }
    });
})

for (let q = 1; q <= 2; q++) {
    for (let a = 1; a <= 4; a++) {
        document.querySelector(".q" + q + "-" + a).addEventListener("click", () => {
            //if (debug) console.log("q" + q + "-" + a + " clicked");
            clearAnswers(q);
            document.querySelector("#q" + q + "-" + a).setAttribute("checked", "checked");
        });
    }
}

function clearAnswers(id) {
    for (let a = 1; a <= 4; a++) {
        try { document.querySelector(".q" + id + "-" + a + ".right").classList.remove("right"); } catch (err) { }
        try { document.querySelector(".q" + id + "-" + a + ".wrong").classList.remove("wrong"); } catch (err) { }
    }
}

const canvas = document.querySelector('#confetti');
const jsConfetti = new JSConfetti();

function celebrate() {
    jsConfetti.addConfetti({
        emojis: ['🌟', '⭐', '💥', '✨', '💫', '👏'],
    }).then(() => jsConfetti.addConfetti())
}