const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//set password length
function handleSlider (){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength
}

function setIndicator(color) {
   
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min ,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum)
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (error) {
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add('active');
    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);

}


    function shufflepassword(array) {
        for (let i = array.length - 1; i > 0; i--) {
          // find out random j
          const j = Math.floor(Math.random() * (i + 1));
          // swap 2 numbers
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        let str = "";
        // array.forEach((el) => (str += el));
        str = array.join("");
        return str;
    }

function handlecheckbox(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    })

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('click' , handlecheckbox)
})


inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click' , (e) => {
    if(passwordDisplay.value){
        copyContent();
    } 
})

generateBtn.addEventListener('click' ,(e) => {

    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        checkCount = passwordLength;
        handleSlider();
    }

    // remove old password

    password = "";

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase()
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase()
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber()
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol()
    // }

    if (password.length) password = "";

    let checkedCbArray = [];

    // add selected checkbox functions to an array
    if(uppercaseCheck.checked) checkedCbArray.push(generateUpperCase);
    if(lowercaseCheck.checked) checkedCbArray.push(generateLowerCase);
    if(numbersCheck.checked) checkedCbArray.push(generateRandomNumber);
    if(symbolsCheck.checked) checkedCbArray.push(generateSymbol);

    // add the required characters - compulsory addition
    for(let i=0; i < checkedCbArray.length; i++){
        password += checkedCbArray[i]();
    }

    // adding random characters till the password length - remaining addition
    for(let i=0; i < (passwordLength - checkedCbArray.length); i++){
        let randomIndex = getRndInteger(0, checkedCbArray.length);
        password += checkedCbArray[randomIndex]();
    }

    password = shufflepassword(Array.from(password));
    passwordDisplay.value = password;

    calcStrength();
})