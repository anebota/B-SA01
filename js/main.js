let student = document.querySelector("#name");
let email = document.querySelector("#email");


function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + "; SameSite=None; Secure; 1 Jan 2030 12:00:00 UTC;";
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
    console.log(document.cookie);
    console.log("name: "+student.value+" email:"+email.value);
})