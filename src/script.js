let text = document.getElementById("text");
let reload = document.getElementById("reload");

let word = "";
let index = 0;
let letters = [];

const specialKeys = {
    " ": "SPACE",
    "Backspace": "BACKSPACE",
    "Tab": "TAB",
    "Enter": "ENTER",
    "CapsLock": "CAPS",
    "\\": "Backslash"
};

function renderText() {
    text.innerHTML = "";
    index = 0;

    for (let letter of word) {
        let span = document.createElement("span");
        span.textContent = letter;
        span.classList.add("text-gray-600");
        text.appendChild(span);
    }

    letters = text.querySelectorAll("span");
}

async function getAIText() {
    let response = await fetch("http://127.0.0.1:8000/generate-text");
    let data = await response.json();

    word = data.text.trim();
    renderText();
}

function pressKey(keyElement) {
    if (!keyElement) return;

    keyElement.classList.remove("bg-gray-600");
    keyElement.classList.add("bg-blue-500");
}

function releaseKey(keyElement) {
    if (!keyElement) return;

    keyElement.classList.remove("bg-blue-500");
    keyElement.classList.add("bg-gray-600");
}

function pressShiftKeys() {
    pressKey(document.getElementById("SHIFT-1"));
    pressKey(document.getElementById("SHIFT-2"));
}

function releaseShiftKeys() {
    releaseKey(document.getElementById("SHIFT-1"));
    releaseKey(document.getElementById("SHIFT-2"));
}

getAIText();

reload.addEventListener("click", getAIText);

document.addEventListener("keydown", function (event) {
    if (["Tab", " "].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === "Shift") {
        pressShiftKeys();
    } else {
        let keyId = specialKeys[event.key] || event.key.toUpperCase();
        let keyElement = document.getElementById(keyId);
        pressKey(keyElement);
    }

    if (!word) return;

    if (event.key === "Backspace") {
        if (index > 0) {
            index--;

            letters[index].classList.remove("text-gray-400");
            letters[index].classList.add("text-gray-600");
        }

        return;
    }

    if (index >= word.length) return;

    if (event.key === word[index]) {
        letters[index].classList.remove("text-gray-600");
        letters[index].classList.add("text-gray-400");

        index++;

        if (index === word.length) {
            getAIText();
        }
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "Shift") {
        releaseShiftKeys();
    } else {
        let keyId = specialKeys[event.key] || event.key.toUpperCase();
        let keyElement = document.getElementById(keyId);
        releaseKey(keyElement);
    }
});