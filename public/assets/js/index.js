let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let clearBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = async () => {
  try {
    console.log('Save Note button clicked');

    const newNote = {
      title: noteTitle.value,
      text: noteText.value
    };

    // Save the note and wait for the response
    await saveNote(newNote);

    // After saving, get and render the updated notes
    await getAndRenderNotes();

    // Render the active note
    renderActiveNote();
  } catch (error) {
    console.error('Error in handleNoteSave:', error);

    // You can add additional error handling here, such as displaying an alert
    // or updating the UI to inform the user about the error.
  }
};

// Delete the clicked note
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  console.log('')
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

// Renders the appropriate buttons based on the state of the form
const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  try {
    let jsonNotes = await notes.json();

    // Log the received JSON to understand its structure
    console.log('Received JSON:', jsonNotes);

    if (Array.isArray(jsonNotes)) {
      // If the response is an array, proceed with rendering
      if (window.location.pathname === '/notes') {
        noteList.forEach((el) => (el.innerHTML = ''));
      }

      let noteListItems = [];

      // Returns HTML element with or without a delete button
      const createLi = (text, delBtn = true) => {
        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item');

        const spanEl = document.createElement('span');
        spanEl.classList.add('list-item-title');
        spanEl.innerText = text;
        spanEl.addEventListener('click', handleNoteView);

        liEl.append(spanEl);

        if (delBtn) {
          const delBtnEl = document.createElement('i');
          delBtnEl.classList.add(
            'fas',
            'fa-trash-alt',
            'float-right',
            'text-danger',
            'delete-note'
          );
          delBtnEl.addEventListener('click', handleNoteDelete);

          liEl.append(delBtnEl);
        }

        return liEl;
      };

      if (jsonNotes.length === 0) {
        noteListItems.push(createLi('No saved Notes', false));
      } else {
        jsonNotes.forEach((note) => {
          const li = createLi(note.title);
          li.dataset.note = JSON.stringify(note);

          noteListItems.push(li);
        });
      }

      if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => noteList[0].append(note));
      }
    } else {
      // If the response is an object, display a message on the page
      const errorMessage = document.createElement('div');
      errorMessage.innerHTML = 'Unable to render notes. Unexpected data format.';
      errorMessage.classList.add('alert', 'alert-danger', 'mt-3');
      document.querySelector('.col-8').appendChild(errorMessage);

      // Log a warning about the unexpected response structure
      console.warn('Received a non-array response. Unable to render notes.');
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

console.log('HELLO THERE!');

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', () => {
    console.log('Save Note button clicked');
    handleNoteSave();
  });
  
  newNoteBtn.addEventListener('click', () => {
    console.log('New Note button clicked');
    handleNewNoteView();
  });

  clearBtn.addEventListener('click', () => {
    console.log('Clear Form button clicked');
    renderActiveNote();
  });

  noteForm.addEventListener('input', () => {
    console.log('Input detected');
    handleRenderBtns();
  });
}


getAndRenderNotes();