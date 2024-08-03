let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("#voices")
let autoplay = false;
let view = "quiz";
let max = 0;
let currentSection = 0;
let currentQuestion = 0;
let debug = true;
let defaultvoice = 2;
var lastId;
var imported = [];

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
        .then((data) =>
            console.log(data))
        .catch ((error) =>
        console.error("Unable to fetch data:", error));
        if (debug) console.log("learn: "+imported);
    }
fetchJSONData();



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
    let index = 0;
    if (view == "learn") {
        index = parseInt(document.querySelector(".carousel-item.active").getAttribute("data-index")) - 2;
    } else {
        index = parseInt(document.querySelector(".questions.active").getAttribute("data-index")) - 1;
    }
    updateProcessBar(index - 1);
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
        index = parseInt(document.querySelector(".carousel-item.active").getAttribute("data-index"));
    } else {
        index = parseInt(document.querySelector(".questions.active").getAttribute("data-index")) + 1;
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
    if (index == 0) {
        document.querySelector("#prev").classList.add("disabled");
    } else {
        document.querySelector("#prev").classList.remove("disabled");
    }
    if (index == max) {
        document.querySelector("#next").classList.add("disabled");
        document.querySelector("#quiz").classList.remove("disabled");
    } else {
        document.querySelector("#next").classList.remove("disabled");
    }
}

function showContent(index) {
    if (debug) console.log("content: section" + (index));
    if (view == "learn") {
        document.querySelector(".learnsection.active").classList.remove("active");
        document.querySelector("#section" + parseInt(index + 1)).classList.add("active");
        currentSection = parseInt(index);
        if (debug) console.log("current: section" + (currentSection));
    } else {
        document.querySelector(".questions.active").classList.remove("active");
        document.querySelector("#q" + parseInt(index)).classList.add("active");
        currentQuestion = parseInt(index);
        if (debug) console.log("current: question" + (currentQuestion));
    }

}

function updateProcessBar(section) {
    let current = 0;
    if (view == "learn") {
        if (debug) console.log("index: " + (section));
        max = parseInt(document.querySelectorAll(".learn section h2").length) - 1;
        currentSection = section;
        current = currentSection;
    } else {
        max = parseInt(document.querySelectorAll(".quiz section h3").length);
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
    let section = parseInt(document.querySelector(".carousel-item.active").getAttribute("data-index")) + parseInt(offset) - 1;
    if (debug) console.log("index: " + section);
    let titles = document.querySelectorAll(".learn section h2");
    let paragraphs = document.querySelectorAll(".learn section p");
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
        let listitems = next.querySelectorAll(".learn section li");
        listitems.forEach(item => list += item.innerHTML + "; ");
    } catch (err) {
        if (debug) console.log("no list");
    }
    speech.text = removeTags(titles[section].innerHTML + ": " + paragraphs[section].innerHTML + " " + list).replace(/\s+/g, " ");
    if (debug) console.log("read text:" + speech.text);
    window.speechSynthesis.speak(speech);
}


document.querySelector("#learn").addEventListener("click", () => {
    document.querySelector(".learn").classList.remove("hide");
    document.querySelector(".quiz").classList.add("hide");
    document.querySelector("#learn").classList.add("active");
    document.querySelector("#quiz").classList.remove("active");
    view = "learn";
    updateProcessBar(currentSection);
    checkNav(currentSection);
})

document.querySelector("#quiz").addEventListener("click", () => {
    window.speechSynthesis.cancel();
    document.querySelector(".quiz").classList.remove("hide");
    document.querySelector(".learn").classList.add("hide");
    document.querySelector("#quiz").classList.add("active");
    document.querySelector("#learn").classList.remove("active");
    view = "quiz";
    updateProcessBar(currentQuestion);
    checkNav(currentQuestion);
})

document.querySelectorAll(".quizbutton").forEach(quizbutton => {
    let id = quizbutton.id;
    if (debug) console.log('question' + id);
    quizbutton.addEventListener("click", () => {
        for (let i = 1; i <= 4; i++) {
            let answer = document.querySelector("#" + id + "-" + i);
            if (debug) console.log(id + ' answer' + i + ": " + answer.checked);
            if (debug) console.log("correct answer: " + answer.classList.contains("correct"));
            if ((answer.checked == true) && (answer.classList.contains("correct"))) {
                document.querySelector("#quizhint").innerHTML = "Correct!";
                document.querySelector("label." + id + "-" + i).classList.add("right");
            }
            if ((answer.checked == true) && (answer.classList.contains("incorrect"))) {
                document.querySelector("#quizhint").innerHTML = "Incorrect!";
                document.querySelector("label." + id + "-" + i).classList.add("wrong");
            }
        }
    });
})

for (let q = 1; q <= 1; q++) {
    for (let a = 1; a <= 4; a++) {
        document.querySelector(".q" + q + "-" + a).addEventListener("click", () => {
            if (debug) console.log("q" + q + "-" + a + "clicked");
            try { document.querySelector(".q" + q + "-" + a + ".right").classList.remove("right"); } catch (err) { }
            try { document.querySelector(".q" + q + "-" + a + ".wrong").classList.remove("wrong"); } catch (err) { }
            document.querySelector("#q" + q + "-" + a).setAttribute("checked", "checked");
        });
    }
}


/* removed scroll functionality
document.querySelector("#content").addEventListener("scroll", () => {
    // Get container scroll position
    var fromTop = document.querySelector("#content").scrollTop+document.querySelector("#content").offsetTop;

    //console.log("fromTop: "+fromTop);
    // Get id of current scroll item 
    //console.log(document.querySelectorAll("section"));
    var cur;
    document.querySelectorAll(".learn section").forEach(item => {
        //console.log(item.id+": "+item.offsetTop);
        if (item.offsetTop < fromTop)
            cur = item;
    });
    //console.log(cur);
    // Get the id of the current element
    try {
        var id = cur.id;
    } catch (err) {
        var id = "section1";
    }

    if (lastId !== id) {
        lastId = id;
        // Set/remove active class
        slide = id.replace("section","slide");
        index = parseInt(id.replace("section",""))-1;
        if (debug) console.log("slide: "+slide);
        document.querySelector(".carousel-item.active").classList.remove("active");
        document.querySelector("#"+slide).classList.add("active");
        updateProcessBar(index);
        if (debug) console.log("id: " + id);
        checkNav(index);
    }
});
*/