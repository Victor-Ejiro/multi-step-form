
let userId = 1;
let plan = [];
let addOns = [];
let userDatabase = [];
let slideIndex = 1;

changeContent(slideIndex);
function plusContent(e, n) { e.preventDefault(); changeContent(slideIndex += n); } // For Changing content consecutively
function currentContent(n) { changeContent(slideIndex = n); } // For Displaying a certain content


function changeContent(n) { // For changing content
    let steps = document.querySelectorAll("[data-step]");
    let listTags = document.querySelectorAll("[data-indicator]");

    if (n > steps.length) {slideIndex = "end"}
    steps.forEach((elem) => { elem.classList.add("hide") });
    listTags.forEach((elem) => {elem.classList.remove("list-tag--active") });

    if(slideIndex === "end") { 
        steps[steps.length-1].classList.add("hide");
        listTags[steps.length-1].classList.add("list-tag--active");
    }else{
        steps[slideIndex-1].classList.remove("hide");
        listTags[slideIndex-1].classList.add("list-tag--active");
    }
}


function saveToDatabase() {
    const purchase = {
        id: userId,
        userName: document.querySelector("#name").value,
        userEmail: document.querySelector("#email").value,
        userPhone: document.querySelector("#number").value,
        services: [plan, addOns]
    }
    userId++;
    userDatabase[userDatabase.length] = purchase;
    addEvHandler(".container", "click", containerEleFunc);
}

function containerEleFunc() { 
    let elem = document.querySelector(".container")
    if(elem.dataset.click !== "false") {
        toggleSwitch(".restart-dialog-box", "hide");
    }
    elem.dataset.click = "true" 
}
function addEvHandler(selector, event, task) {
    document.querySelector(selector).addEventListener(event, task)
}
function removeEvHandler(selector, event, task) {
    document.querySelector(selector).dataset.click = (document.querySelector(selector).dataset.click === "true")? "false" : "";
    document.querySelector(selector).removeEventListener(event, task)
}


function storeItem(elems, selector) {
    addOns = [];
    elems.forEach((elem) => {
        elem.querySelectorAll(selector).forEach((child) => {
            if(child.className !== "hide") {
                if(elem.control.name === "plan") {
                    plan[0] = {
                        name: elem.control.value,
                        price: child.querySelector("[data-amnt]").dataset.amnt,
                        duration: child.dataset.subDuration
                    }
                }else{
                    addOns[addOns.length] = {
                        name: elem.control.value,
                        price: child.querySelector("[data-amnt]").dataset.amnt,
                        priceTag: child.querySelector("[data-amnt]").textContent
                    }
                }
            }
        })
    })
}

function purchaseSummary() {
    const planName = document.querySelector("[data-summary=plan-name]");
    const planAmnt = document.querySelector("[data-summary=plan-amnt]");
    const textTotal = document.querySelector("[data-summary=text-total]");
    const addOnsContainer = document.querySelector("[data-summary=add-ons]");
    const totalAmnt = document.querySelector("[data-summary=total-amnt]");
    let t = 0;

    planName.textContent = `${plan[0].name} (${plan[0].duration})`;
    planAmnt.textContent = (plan[0].duration === "Monthly")? `$${plan[0].price}/mo` : `$${plan[0].price}/yr`;
    textTotal.textContent = (plan[0].duration === "Monthly")? `Total (per month)` : `Total (per year)`;

    addOnsContainer.innerHTML = "";
    addOns.forEach((addOn) => {
        addOnsContainer.innerHTML += `
            <p class="flex-sb u-mb-tiny">
                <span class="description">${addOn.name}</span>
                <span class="description u-color-pri">${addOn.priceTag}</span>
            </p>
        `;
        t += Number(addOn.price);
    });
    t += Number(plan[0].price);
    totalAmnt.textContent = (plan[0].duration === "Monthly")? `+$${t}/mo` : `+$${t}/yr`;
}


function isChecked(e, form) {
    e.preventDefault();
    const formLabels = form.querySelectorAll("[data-elem=label]"),
          formMessage = form.querySelector("[data-msg=error]");
    let x = 0,
        store = [];

    formMessage.textContent = "";
    formLabels[0].parentElement.classList.remove("border--error");
    formLabels.forEach((label) => {
        if(label.control.checked === true) {
            store[x] = label;
            x++
        } 
    });

    if(x === 0) {
        formMessage.textContent = "No selection was made";
        formLabels[0].parentElement.classList.add("border--error");
    }else{
        storeItem(store, "[data-sub-duration]")
        plusContent(e, +1)
    }
}


function validateInput(e, form) {
    e.preventDefault();
    const formInputs = form.querySelectorAll("[data-elem=input]"),
          formMessages = form.querySelectorAll("[data-msg=error]");

    formInputs.forEach((input, ind) => {
        formMessages[ind].textContent = "";
        input.classList.remove("border--error");

        if(input.validity.valueMissing === true) {formMessages[ind].textContent = "This field is required";}
        if(input.validity.typeMismatch === true) {formMessages[ind].textContent = "Email address is not valid";}
        if(input.validity.valueMissing || input.validity.typeMismatch) { input.classList.add("border--error"); }
    });
    if(form.checkValidity()) { plusContent(e, +1)}
}


function toggleSwitch(selector, style) {
    let elem = document.querySelectorAll(selector);
    for(let y = 0; y < elem.length; y++) {

        for(let x=0; x < elem[y].classList.length; x++) {
            if(elem[y].classList[x] === "view") {
                elem[y].classList.replace(elem[y].classList[x], style)
                break;
            }
            if(elem[y].classList[x] === style) {
                elem[y].classList.replace(elem[y].classList[x], "view")
                break;
            }
        }
    }
}

function hideErrOutline(elem, selector) {
    errText = elem.form.querySelector(selector);
    errText.textContent = "";
    elem.classList.remove("border--error");
}

function resetForm(selector) {
    forms = document.querySelectorAll(selector);
    forms.forEach((form) => {
        form.querySelectorAll("[data-sub-duration]").forEach((elem) => {
            if(elem.className === "view" && elem.dataset.subDuration === "Yearly") { toggleSwitch("[data-sub-duration]", "hide") }
        })
        form.reset();
    });
}