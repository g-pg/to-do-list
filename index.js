const inputEl = document.querySelector(".input-el");
const addBtn = document.querySelector(".input-btn");
const uLElToDo = document.querySelector(".list-todo-ul");
const uLElDone = document.querySelector(".list-done-ul");
const titleDoneEl = document.querySelector(".title-done");

let storedArray = JSON.parse(localStorage.getItem("mynotes")) || [{}];

let notesArray = [{}];
let colorListNumber = 1;

function getStoredArray() {
	notesArray = storedArray;
	renderNotes();
}

getStoredArray();

function saveInStorage() {
	storedArray = [{}];
	localStorage.setItem("mynotes", JSON.stringify(notesArray));
}

addBtn.addEventListener("click", function () {
	let newNote = inputEl.value;
	let newNoteOb = { text: newNote, done: false };
	if (newNote != "") {
		notesArray.unshift(newNoteOb);
		inputEl.value = "";
		renderNotes();
	}
});

function renderNotes() {
	let contentToDo = "";
	let contentDone = "";
	notesArray.forEach((el) => {
		if (el.done === false) {
			contentToDo += `<li class="list-item color-list${colorListNumber}">
        <p class="note">${el.text}</p>
        <div class="btn-container">
        <button class="done-btn btn"><img src="img/done-icon.svg"></button>
        <button class="edit-btn btn "><img src="img/pencil-icon.svg"></button>
        <button class="remove-btn btn"><img src="img/close-icon.svg"></button>
    </div>
        </li>`;
		} else {
			contentDone += `<li class="list-item color-list${colorListNumber}">
			<p class="note">${el.text}</p>
			<div class="btn-container">
				<button class="revert-btn btn"><img src="img/arrow-icon.svg"></button>
				<button class="remove-btn btn"><img src="img/close-icon.svg"></button>
			</div>
		</li>`;
		}

		if (colorListNumber === 1) {
			colorListNumber++;
		} else {
			colorListNumber--;
		}
	});

	if (checkIfHastaskDone() === true) {
		titleDoneEl.classList.remove("invisible");
	} else {
		titleDoneEl.classList.add("invisible");
	}

	uLElToDo.innerHTML = contentToDo;
	uLElDone.innerHTML = contentDone;

	let removeBtns = document.querySelectorAll(".remove-btn");
	let editBtns = document.querySelectorAll(".edit-btn");
	let doneBtns = document.querySelectorAll(".done-btn");
	let revertBtns = document.querySelectorAll(".revert-btn");

	removeBtns.forEach((el) => el.addEventListener("click", removeNote));
	editBtns.forEach((el) => el.addEventListener("click", editNote));
	doneBtns.forEach((el) => el.addEventListener("click", markNoteAsDone));
	revertBtns.forEach((el) => el.addEventListener("click", revertDone));

	saveInStorage();
}

function checkIfHastaskDone() {
	let hasTaskDone = notesArray.findIndex((item) => item.done);
	return hasTaskDone != -1;
}

function markNoteAsDone() {
	let noteDone = this.parentElement.parentElement.querySelector(".note");
	let noteDoneContent = noteDone.innerText;
	let indexOfNote = notesArray.findIndex((item) => {
		return item.text === noteDoneContent;
	});
	console.log(indexOfNote);
	notesArray[indexOfNote].done = true;

	renderNotes();
}

function revertDone() {
	let noteToBeReverted = this.parentElement.parentElement.querySelector(".note");
	let noteContent = noteToBeReverted.innerText;
	let indexOfNote = notesArray.findIndex((item) => {
		return item.text === noteContent;
	});
	notesArray[indexOfNote].done = false;

	renderNotes();
}
function removeNote() {
	let liToBeRemoved = this.parentElement.parentElement;
	let noteToBeRemoved = liToBeRemoved.querySelector(".note");
	let indexOfNote = notesArray.findIndex((item) => {
		return (item.text = noteToBeRemoved.innerText);
	});

	notesArray.splice(indexOfNote, 1);
	renderNotes();
}

function editNote() {
	let li = this.parentElement.parentElement;
	let noteToBeEdited = li.querySelector(".note");
	let noteToBeEditedContent = noteToBeEdited.innerText;
	let indexOfNote = notesArray.findIndex((item) => {
		return item.text === noteToBeEditedContent;
	});

	li.innerHTML = `
    <input class="edit-input">
    <div class="btn-container">
    <button class="done-btn btn"><img src="img/done-icon.svg"></button>
    <button class="ok-btn btn">OK</button>
    <button class="remove-btn btn"><img src="img/close-icon.svg"></button>
    </div>
    `;

	let editInput = li.querySelector(".edit-input");
	let editOkBtn = li.querySelector(".ok-btn");

	editInput.value = noteToBeEditedContent;
	editInput.focus();

	window.addEventListener("click", () => {
		editInput.focus();
	});

	editOkBtn.addEventListener("click", () => {
		notesArray[indexOfNote].text = editInput.value;
		renderNotes();
	});

	editInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			editOkBtn.click();
		}
	});
}

window.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		inputEl.focus();
	}
});

inputEl.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		addBtn.click();
	}
});
