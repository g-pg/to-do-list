const inputEl = document.querySelector(".input-el");
const addBtn = document.querySelector(".input-btn");
const uLEl = document.querySelector(".list");

let editBtns = document.querySelectorAll(".edit-btn");
let removeBtns = document.querySelectorAll(".remove-btn");
let storedArray = JSON.parse(localStorage.getItem("mynotes")) || [];

let notesArray = [];
let colorList = 1;

function getStoredArray() {
	notesArray = storedArray;
	renderNotes();
}

getStoredArray();

function saveInStorage() {
	storedArray = [];
	localStorage.setItem("mynotes", JSON.stringify(notesArray));
}

addBtn.addEventListener("click", function () {
	let newNote = inputEl.value;
	if (newNote != "") {
		notesArray.unshift(newNote);
		inputEl.value = "";
		renderNotes();
	}
});

function renderNotes() {
	let content = "";
	notesArray.forEach((el) => {
		if (colorList === 1) {
			content += `<li class="list-item color-list1">
        <p class="note">${el}</p>
        <div class="btn-container">
        <button class="done-btn btn"><img src="img/done-icon.svg"></button>
        <button class="edit-btn btn "><img src="img/pencil-icon.svg"></button>
        <button class="remove-btn btn"><img src="img/close-icon.svg"></button>
    </div>
        </li>`;

			colorList = 2;
		} else {
			content += `<li class="list-item color-list2">
            <p class="note">${el}</p>
            <div class="btn-container">
                <button class="done-btn btn"><img src="img/done-icon.svg"></button>
                <button class="edit-btn btn "><img src="img/pencil-icon.svg"></button>
                <button class="remove-btn btn"><img src="img/close-icon.svg"></button>
            </div>
            </li>`;
			colorList = 1;
		}
	});
	uLEl.innerHTML = content;

	removeBtns = document.querySelectorAll(".remove-btn");
	editBtns = document.querySelectorAll(".edit-btn");
	doneBtns = document.querySelectorAll(".done-btn");

	removeBtns.forEach((el) => el.addEventListener("click", removeNote));
	editBtns.forEach((el) => el.addEventListener("click", editNote));
	doneBtns.forEach((el) => el.addEventListener("click", markNoteAsDone));
	saveInStorage();
}

function markNoteAsDone() {
	let noteTobeDrawn = this.parentElement.parentElement.querySelector(".note");

	noteTobeDrawn.classList.toggle("note-done");

	let noteToBeRemoved = noteTobeDrawn.innerText;
	let indexOfNote = notesArray.indexOf(noteToBeRemoved);

	if (indexOfNote != -1) {
		notesArray.splice(indexOfNote, 1);
	}
}

function removeNote() {
	let liToBeRemoved = this.parentElement.parentElement;
	let noteToBeRemoved = liToBeRemoved.querySelector(".note");
	let indexOfNote = notesArray.indexOf(noteToBeRemoved.innerText);
	noteToBeRemoved.classList.add("remove-style");

	if (indexOfNote != -1) {
		notesArray.splice(indexOfNote, 1);
	}

	saveInStorage();
}

function editNote() {
	let li = this.parentElement.parentElement;
	let noteToBeEdited = li.querySelector(".note");
	let noteToBeEditedContent = noteToBeEdited.innerText;
	let indexOfNote = notesArray.indexOf(noteToBeEditedContent);

	li.innerHTML = `
    <input class="edit-input">
    <div class="btn-container">
    <button class="done-btn btn"><img src="img/done-icon.svg"></button>
    <button class="edit-btn ok-btn">OK</button>
    <button class="remove-btn btn"><img src="img/close-icon.svg"></button>
    </div>
    `;

	let editInput = li.querySelector(".edit-input");
	let editOkBtn = li.querySelector(".ok-btn");
	editInput.focus();
	window.addEventListener("click", () => {
		editInput.focus();
	});
	editInput.value = noteToBeEditedContent;
	editOkBtn.addEventListener("click", () => {
		notesArray.splice(indexOfNote, 1, editInput.value);
		renderNotes();
	});
	editInput.addEventListener("keypress", (e) => {
		if (e.key === "Enter") {
			notesArray.splice(indexOfNote, 1, editInput.value);
			renderNotes();
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
