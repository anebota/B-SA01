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
    button.addEventListener("click", () => {
        window.location.href = id + "/index.htm";
        setCookie(id, "enrolled");
    })
    let cid = getCookie(id);
    console.log(cid);
    if(cid == "enrolled") {
        button.innerHTML = "Enrolled";
        button.classList.remove("btn-primary");
        button.classList.add("btn-success");
    } else {
        button.innerHTML = "Not Available";
        button.classList.remove("btn-primary");
        button.classList.add("btn-secondary");        
    }    
})
