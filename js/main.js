let student = document.querySelector("#name");
let email = document.querySelector("#email");
let african = document.querySelector("#african");

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + "; SameSite=None; Secure; expires=1 Jan 2030 12:00:00 UTC; path=/;";
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

document.querySelector("#register").addEventListener("click", () => {
    checkInfo(student.value, email.value, african.checked);
})

function checkInfo(nm, em, af) {
    try {
        if (nm.length > 0) {
            if (em.length > 0) {
                if (af == true) {
                    setCookie("name", nm);
                    setCookie("email", em);
                    setCookie("african", af);
                    console.log("name: " + nm + " email: " + em + " african:" + af);
                    window.location.href = "dashboard.htm";
                }
            }
        }
    } catch (err) { }
}

function startUp() {
    let cnm = getCookie("name");
    let cem = getCookie("email");
    let caf = getCookie("african");
    try {
        if (cnm.length > 0) {
            if (cem.length > 0) {
                if (caf == "true") {
                    console.log("cname: " + cnm + " cemail: " + cem + " cafrican: "+caf);
                    document.querySelector("#name").value = cnm;
                    document.querySelector("#email").value = cem;
                    document.querySelector("#african").checked = true;
                    document.querySelector("#title").innerHTML = "Welcome";
                    document.querySelector("#register").innerHTML = "Login";
                } else {
                    document.querySelector("#title").innerHTML = "Registration";
                    document.querySelector("#register").innerHTML = "Register";
                }
            }
        }
    } catch (err) { }
}

startUp();
