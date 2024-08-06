(function() {
const root = document.documentElement;
const fretboard = document.querySelector('.fretboard');
const instrumentSelector = document.querySelector('#instrument-selector');
const accidentalSelector = document.querySelector('.accidental-selector');
const numberOfFretsSelector = document.querySelector('#number-of-frets');
const noteSetSelector = document.querySelector('.note-set-selector');
const gamemodeSelector = document.querySelector('.gamemode-selector');
const noteNameSection = document.querySelector('.note-name-section');
const stringSelector = document.querySelector('#string-selector')
const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
const doubleFretMarkPositions = [12, 24];
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const enumeratedNotes = new Map([
    ["C", 0], ["C#", 1], ["Db", 1], ["D", 2],
    ["D#", 3], ["Eb", 3], ["E", 4], ["F", 5],
    ["F#", 6], ["Gb", 6], ["G", 7], ["G#", 8],
    ["Ab", 8], ["A", 9], ["A#", 10], ["Bb", 10],
    ["B", 11]
]);
const instrumentTuningPresets = {
    'Guitar': [4, 11, 7, 2, 9, 4],
    'Bass (4 strings)': [7, 2, 9, 4],
    'Bass (5 strings)': [7, 2, 9, 4, 11],
    'Ukulele': [9, 4, 0, 7]
};
let allNotes;
let showMultipleNotes = false;
let showAllNotes = false;
let numberOfFrets = 12;
let accidentals = 'flats';
let selectedInstrument = 'Guitar';
let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
let gamemode = 'fret';
let noteSet = 'naturals';

const app = {
    init() {
     this.setupFretboard();
     this.setupinstrumentSelector();
     this.setupNoteNameSection();
     this.setupStringSelection();
     handlers.setupEventListeners();
    },
    setupFretboard() {
        fretboard.innerHTML = '';
        root.style.setProperty('--number-of-strings', numberOfStrings);
        // Add strings to fretboard
        for (let i = 0; i < numberOfStrings; i++) {
            let string = tools.createElement('div');
            string.classList.add('string');
            fretboard.appendChild(string);
         
            // Create frets
            for (let fret = 0; fret <= numberOfFrets; fret++) {
                let noteFret = tools.createElement('div');
                noteFret.classList.add('note-fret');
                string.appendChild(noteFret);
                
                let noteName = this.generateNoteNames((fret + instrumentTuningPresets[selectedInstrument][i]), accidentals);
                noteFret.setAttribute('data-note', noteName);
                
                // Add single fret marks
                if (i === 0 && singleFretMarkPositions.indexOf(fret) !== -1) {
                    noteFret.classList.add('single-fretmark');
                }

                if (i === 0 && doubleFretMarkPositions.indexOf(fret) !== -1) {
                    let doubleFretMark = tools.createElement('div');
                    doubleFretMark.classList.add('double-fretmark');
                    noteFret.appendChild(doubleFretMark);
                }

            }
        }
        allNotes = document.querySelectorAll('.note-fret');
    },
    generateNoteNames(noteIndex, accidentals) {
        noteIndex = noteIndex % 12;
        let noteName;
        if (accidentals === 'flats') {
            noteName = notesFlat[noteIndex];
        } else if (accidentals === 'sharps') {
            noteName = notesSharp[noteIndex];
        }
        return noteName;
    },
    setupinstrumentSelector() {
        for (instrument in instrumentTuningPresets) {
            let instrumentOption = tools.createElement('option', instrument);
            instrumentSelector.appendChild(instrumentOption);
        }
    },
    setupNoteNameSection() {
        noteNameSection.innerHTML = '';
        let noteNames;
        if (accidentals === 'flats') {
            noteNames = notesFlat;
        } else {
            noteNames = notesSharp;
        }
        noteNames.forEach((noteName) => {
            let noteNameElement = tools.createElement('span', noteName);
            noteNameSection.appendChild(noteNameElement);
        });
    },
    toggleMultipleNotes(noteName, opacity) {
        for (let i = 0; i < allNotes.length; i++) {
            if (allNotes[i].dataset.note === noteName) {
                allNotes[i].style.setProperty('--noteDotOpacity', opacity);
            }
        }
    },
    setupStringSelection() {
        stringSelector.innerHTML = '';
        let strings = instrumentTuningPresets[selectedInstrument].map((x) => x);
        strings.reverse();

        for(let i = 0; i < strings.length; ++i) {
            let stringName = notesSharp[strings[i]];
            let label = tools.createElement('label', stringName);
            label.setAttribute('for', `string-select-${stringName}`);
            stringSelector.appendChild(label);
            let checkBox = tools.createElement('input');
            checkBox.setAttribute('type', 'checkbox');
            checkBox.setAttribute('id', `string-select-${stringName}`);
            checkBox.setAttribute('value', stringName);
            checkBox.setAttribute('checked', '');
            stringSelector.appendChild(checkBox);
        }


    }
}

const handlers = {
    showNoteDot(event) {
        // Check if show all notes is selected
        if (showAllNotes) {
            return;
        }
        if (event.target.classList.contains('note-fret')) {
            if (showMultipleNotes) {
                app.toggleMultipleNotes(event.target.dataset.note, 1);
            } else {
                event.target.style.setProperty('--noteDotOpacity', 1);
            }
        }
    },
    hideNoteDot(event) {
        if (showAllNotes) {
            return;
        }
        if (showMultipleNotes) {
            app.toggleMultipleNotes(event.target.dataset.note, 0);
        } else {
            event.target.style.setProperty('--noteDotOpacity', 0);
        }
        
    },
    setSelectedInstrument(event) {
        selectedInstrument = event.target.value;
        numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
        app.setupFretboard();
        app.setupStringSelection();
    },
    setAccidentals(event) {
        if (event.target.classList.contains('acc-select')) {
            accidentals = event.target.value;
            app.setupFretboard();
            app.setupNoteNameSection();
        } else {
            return;
        }
    },
    setGamemode(event) {
        if(event.target.getAttribute('name') === 'gamemode') {
            gamemode = event.target.value;
        }
        console.log("Gamemode: ", gamemode);
    },
    setNoteSet(event){
        if(event.target.getAttribute('name') === 'note-set') {
            noteSet = event.target.value;
        }
        console.log("NoteSet: ", noteSet);
    },
    setNumberOfFrets() {
        numberOfFrets = numberOfFretsSelector.value;
        app.setupFretboard();
    },
    setShowAllNotes() {
        showAllNotes = showAllNotesSelector.checked;
        if (showAllNotes) {
            root.style.setProperty('--noteDotOpacity', 1);
            app.setupFretboard();
        } else {
            root.style.setProperty('--noteDotOpacity', 0);
            app.setupFretboard();
        }
    },
    setShowMultipleNotes() {
        showMultipleNotes = !showMultipleNotes;
    },
    setNotesToShow(event) {
        let noteToShow = event.target.innerText;
        app.toggleMultipleNotes(noteToShow, 1);
    },
    setNotesToHide(event) {
        if (!showAllNotes) {
            let noteToHide = event.target.innerText;
            app.toggleMultipleNotes(noteToHide, 0);
        } else {
            return;
        }
    },
    testCorrectLocation(event) {
        // Needs to be worked on
        let clickedNote = event.target.getAttribute('data-note');
        clickedNote = enumeratedNotes.get(clickedNote);
        console.log(clickedNote);

    },
    testCorrectNote(event) {
        // Needs to be worked on
        let clickedNote = event.target.innerText;
        clickedNote = enumeratedNotes.get(clickedNote);
        console.log(clickedNote);
    },
    promptQuestion(event) {
        if(event.code != "Space") return;
        if(gamemode === 'fret') {
            // code for fret game
        }
        else if(gamemode === 'note') {
            // code for note game
        }
    },
    setupEventListeners() {
        fretboard.addEventListener('mouseover', this.showNoteDot);
        fretboard.addEventListener('mouseout', this.hideNoteDot);
        fretboard.addEventListener('click', this.testCorrectLocation);
        instrumentSelector.addEventListener('change', this.setSelectedInstrument);
        accidentalSelector.addEventListener('click', this.setAccidentals);
        numberOfFretsSelector.addEventListener('change', this.setNumberOfFrets);
        noteSetSelector.addEventListener('click', this.setNoteSet);
        gamemodeSelector.addEventListener('click', this.setGamemode);
        noteNameSection.addEventListener('click', this.testCorrectNote);
        document.addEventListener('keydown', this.promptQuestion);
    }
}


const tools = {
    createElement(element, content) {
        element = document.createElement(element);
        if (arguments.length > 1) {
            element.innerHTML = content;
        }
        return element;
    }
}


app.init();
})();


