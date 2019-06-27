// Variables
const date = document.getElementById("date");
const time = document.getElementById("time");
const name = document.getElementById("name");
const notesArea = document.getElementById("notes-area");

const notes = document.querySelector(".notes");
const mainTitle = document.querySelector(".main-title");
const mainNotes = document.querySelector(".main-notes");
const saveNotes = document.querySelector(".save-notes");
const clearNotes = document.querySelector(".clear-notes");

// Arrays
let NOTES, id;

// Storage
let getData = localStorage.getItem("notako");


// Date
const format = {weekday: "long", month: "short", day: "numeric", year: "numeric"};
const today = new Date();
date.innerHTML = today.toLocaleDateString("en-US",format);



// Time
function showTime() {
  let currentDate = new Date();
  let hr = currentDate.getHours();
  let min = currentDate.getMinutes();

  // AM PM
  const convention = hr >= 12 ? "PM" : "AM";

  // 12 Hr Format
  hr = hr % 12 || 12;

  time.innerHTML = `${hr}:${addZero(min)} ${convention}`;

  setTimeout(showTime, 1000);
}

// Add zero to minutes
function addZero(mins) {
  return (parseInt(mins, 10) < 10 ? "0" : "") + mins;
}

// Set and Get Name function
function setName(event) {
  if (event.keyCode === 13) {
    localStorage.setItem("name", event.target.innerText);
    name.blur();
  } else {
    localStorage.setItem("name", event.target.innerText);
  }
}

function getName() {
  if (
    localStorage.getItem("name") === null ||
    localStorage.getItem("name") === ""
  ) {
    name.style.color = "#808080";
    name.textContent = "[You are?]";
  } else {
    name.style.color = "#303030";
    name.style.fontWeight = "400";
    name.textContent = localStorage.getItem("name");
  }
}

// Set and Get  Title and Notes functions
function setTitle(event) {
  localStorage.setItem("mainTitle", event.target.innerText);
}

function setNotes(event) {
  localStorage.setItem("mainNotes", event.target.innerText);
}

function getTitle() {
    mainTitle.innerText = localStorage.getItem("mainTitle");
  
}
function getNotes() {
    mainNotes.innerText = localStorage.getItem("mainNotes");
}

// Show local storage data
if (getData == null) {
  NOTES = [];
  id = 0;
} else {
  NOTES = JSON.parse(getData);
  id = NOTES.length;
  loadNotes(NOTES);
}

// Add Notes
function addNotes(theTitle, id, theNotes, deleteNotes) {
  if (deleteNotes) {
    return;
  }
  const notesContainer = `<div class="notes-container">
                            <div class="notes-header">
                                    <h3 class="title">${theTitle}</h3>
                                    <span class="delete" id="${id}"><i class="fas fa-times"></i></span>
                            </div>
                            <div class="notes">
                           ${theNotes}
                            </div>
                        </div>`;

  notesArea.insertAdjacentHTML("beforeend", notesContainer);
}

// Load Notes function
function loadNotes(array) {
  array.forEach(function(element) {
    addNotes(element.title, element.id, element.notes, element.deletenotes);
  });
}

// Delete Notes function
function deleteNotes(element) {
  element.parentElement.parentElement.remove();
  NOTES[element.id].deletenotes = true;
  localStorage.setItem("notako", JSON.stringify(NOTES));
}

// Event Listeners
name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);

mainTitle.addEventListener("blur", setTitle);
mainNotes.addEventListener("blur", setNotes);

notesArea.addEventListener("click", event => {
  if (event.target.parentElement.classList.contains("delete")) {
    if (confirm("Delete this note?")) {
      deleteNotes(event.target.parentElement);
    } else {
      return;
    }
  }
});

saveNotes.addEventListener("click", () => {
  let mainTitle = document.querySelector(".main-title").innerHTML;
  let mainNotes = document.querySelector(".main-notes").innerHTML;
  if(mainTitle == ""){
    mainTitle = "No Title";
  }
  if(mainNotes == ""){
    mainNotes = "Blank Notes";
  }
  addNotes(mainTitle, id, mainNotes, false);
  NOTES.push({
    title: mainTitle,
    id: id,
    notes: mainNotes,
    deletenotes: false
  });
  id++;
  localStorage.setItem("notako", JSON.stringify(NOTES));
});

clearNotes.addEventListener("click", () => {
  if (
    confirm(
      "Clear current notes?"
    )
  ) {
    document.querySelector(".main-title").innerText = "";
    document.querySelector(".main-notes").innerText = "";
    localStorage.setItem(
      "mainTitle",
      document.querySelector(".main-title").innerText
    );
    localStorage.setItem(
      "mainNotes",
      document.querySelector(".main-notes").innerText
    ); 
  }
})


// Shortcut Key [CTRL + Enter] to save notes
document.addEventListener("keydown", function(event) {
  if (event.ctrlKey && event.keyCode == 13) {
    const mainTitle = document.querySelector(".main-title").innerHTML;
    const mainNotes = document.querySelector(".main-notes").innerHTML;
    addNotes(mainTitle, id, mainNotes, false);

    NOTES.push({
      title: mainTitle,
      id: id,
      notes: mainNotes,
      deletenotes: false
    });
    id++;
    localStorage.setItem("notako", JSON.stringify(NOTES));

    if (confirm("Clear fields when saved?")) {
      document.querySelector(".main-title").innerText = "";
      document.querySelector(".main-notes").innerText = "";
      localStorage.setItem(
        "mainTitle",
        document.querySelector(".main-title").innerText
      );
      localStorage.setItem(
        "mainNotes",
        document.querySelector(".main-notes").innerText
      ); 
      document.querySelector(".main-title").blur();
      document.querySelector(".main-notes").blur();
    } else{
      document.querySelector(".main-title").blur();
      document.querySelector(".main-notes").blur();
        }
  }
  if (event.ctrlKey && event.altKey && event.keyCode == 82) {
    if (
      confirm(
        "You are about to reset your settings. Notes will be deleted. Proceed?"
      )
    ) {
      localStorage.clear();
      this.location.reload();
    }
  }
  if (event.ctrlKey && event.altKey && event.keyCode == 8) {
    if (
      confirm(
        "Clear current notes?"
      )
    ) {
      document.querySelector(".main-title").innerText = "";
      document.querySelector(".main-notes").innerText = "";
      localStorage.setItem(
        "mainTitle",
        document.querySelector(".main-title").innerText
      );
      localStorage.setItem(
        "mainNotes",
        document.querySelector(".main-notes").innerText
      ); 
    }
  }
});

// Run functions
showTime();
getName();
getTitle();
getNotes();
