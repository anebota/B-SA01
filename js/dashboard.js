function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + "; SameSite=None; Secure; expires=1 Jan 2030 12:00:00 UTC;";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function startUp() {
}

startUp();

document.querySelectorAll(".start-course").forEach(button => {
    let id = button.id;
    let cid = getCookie(id);
    button.addEventListener("click", () => {
        window.location.href = id + "/index.htm";
        if (cid != "completed") { setCookie(id, "enrolled"); }
    })
    
    console.log(cid);
    if (cid == "enrolled") {
        button.innerHTML = "Enrolled";
        button.classList.remove("btn-primary");
        button.classList.add("btn-success");
        button.disabled = false;
    } else if (cid == "completed") {
        button.innerHTML = "Completed";
        button.classList.remove("btn-primary");
        button.classList.add("btn-success");
        button.disabled = false;
    } else {
        if (checkCourse(id, cid)) {
            button.innerHTML = "Start Learning";
            button.classList.add("btn-primary");
            button.classList.remove("btn-secondary");
            button.disabled = false;
        } else {
            button.innerHTML = "Not Available";
            button.classList.remove("btn-primary");
            button.classList.add("btn-secondary");
            button.disabled = true;
        }
    }
})

function checkCourse(id, cid) {
    let cid1 = getCookie("B-CH01");
    let cid2 = getCookie("B-OS01");
    let cid3 = getCookie("B-NB01");
    let cid4 = getCookie("B-SA01");
    let cid5 = getCookie("B-CS01");
    switch (true) {
        case (id == "B-CH01" && cid == ""):
            //begin program path
            return true;
        case (id == "B-OS01" && cid1 == "completed" && cid == ""):
            //do something
            return true;
        case (id == "B-NB01" && cid1 == "completed" && cid2 == "completed" && cid == ""):
            //do something
            return true;
        case (id == "B-SA01" && cid1 == "completed" && cid2 == "completed" && cid3 == "completed" && cid == ""):
            //do something
            return true;
        case (id == "B-CS01" && cid1 == "completed" && cid2 == "completed" && cid3 == "completed" && cid4 == "completed" && cid == ""):
                //do something
                return true;
    
        default:
            return false;
    }

}