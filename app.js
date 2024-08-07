(function() {
    const root = document.documentElement;
    const fretboard = document.querySelector('.fretboard');
    const instrumentSelector = document.querySelector('#instrument-selector');
    const accidentalSelector = document.querySelector('.accidental-selector');
    const numberOfFretsSelector = document.querySelector('#number-of-frets');
    const noteSetSelector = document.querySelector('.note-set-selector');
    const gamemodeSelector = document.querySelector('.gamemode-selector');
    const noteNameSection = document.querySelector('.note-name-section');
    const stringSelector = document.querySelector('#string-selector');
    const gamePrompt = document.querySelector('.game-prompt h1');
    const singleFretMarkPositions = [3, 5, 7, 9, 15, 17, 19, 21];
    const doubleFretMarkPositions = [12, 24];
    const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const notesNatural = ["C", "D", "E", "F", "G", "A", "B"];
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
    let numberOfFrets = 12;
    let accidentals = 'flats';
    let selectedInstrument = 'Guitar';
    let numberOfStrings = instrumentTuningPresets[selectedInstrument].length;
    let gamemode = 'fret';
    let noteSet = 'naturals';
    let gameState = {
        inPlay : false,
        selectedString : '',
        selectedNote : '',
    }
    
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
                let stringName = this.generateNoteNames(instrumentTuningPresets[selectedInstrument][i], accidentals);
                string.setAttribute('data-name', stringName);
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
                let stringName = this.generateNoteNames(strings[i], accidentals);
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
            if (event.target.classList.contains('note-fret')) {
                event.target.style.setProperty('--noteDotOpacity', 1);
            }
        },
        hideNoteDot(event) {
            event.target.style.setProperty('--noteDotOpacity', 0);   
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
            handlers.promptQuestion(event);
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
        setNotesToShow(event) {
            let noteToShow = event.target.innerText;
            app.toggleMultipleNotes(noteToShow, 1);
        },
        testCorrectLocation(event) {
            if(!gameState.inPlay) return;
            if(!event.target.classList.contains('note-fret')) return;
            let clickedNote = event.target.getAttribute('data-note');
            clickedNote = enumeratedNotes.get(clickedNote);
            let expectedNote = enumeratedNotes.get(gameState.selectedNote);
            let clickedString = event.target.parentNode.getAttribute('data-name');
            if(clickedNote === expectedNote && clickedString === gameState.selectedString) {
                gamePrompt.innerText = "Congrats! You got it right!\nPress [space] to continue";
            }
            else {
                gamePrompt.innerText = "You got it wrong!\nPress [space] to continue";
                let displayFret = fretboard.querySelector(`.string[data-name="${gameState.selectedString}"]`);
                displayFret = displayFret.querySelector(`.note-fret[data-note="${gameState.selectedNote}"]`);
                displayFret.classList.add('note-fret-pink');
            }
    
        },
        testCorrectNote(event) {
            // Needs to be worked on
            let clickedNote = event.target.innerText;
            clickedNote = enumeratedNotes.get(clickedNote);
            let expectedNote = enumeratedNotes.get(gameState.selectedNote);
            if(clickedNote === expectedNote) {
                gamePrompt.innerText = "Congrats! You got it right!\nPress [space] to continue";
            }
            else {
                gamePrompt.innerText = `You got it wrong! The correct note was ${gameState.selectedNote}`;
            }
        },
        promptQuestion(event) {
            if(event.type === 'keydown' && event.code != "Space") return;
            // set all the noteDots to be invisible from the previous round
            let noteDots = fretboard.querySelectorAll('.note-fret');
            for(let i = 0; i < noteDots.length; ++i)
                noteDots[i].classList.remove('note-fret-pink');

            gameState.inPlay = true;

            // get the current valid strings we can choose from and select a random string
            let stringSelection = Array.from(stringSelector.querySelectorAll('input'));
            stringSelection = stringSelection.filter((box) => box.checked);
            stringSelection = stringSelection.map((box) => box.value);
            gameState.selectedString = stringSelection[Math.floor(Math.random() * stringSelection.length)];

            if(gameState.selectedString === undefined) {
                gameState.inPlay = false;
                gamePrompt.innerText = 'You must have at least 1 string selected';
                return; 
            }
            // select a random note
            // if the gamemode is set to naturals only, make sure it's only naturals
            let selectedNote = '';
            if(noteSet === 'naturals') {
                gameState.selectedNote = notesNatural[Math.floor(Math.random() * notesNatural.length)];
            }
            else if (noteSet === 'chromatic') {
                gameState.selectedNote = Math.floor(Math.random() * notesFlat.length);
                gameState.selectedNote = app.generateNoteNames(gameState.selectedNote, accidentals);
            }
            if(gamemode === 'fret') {
                gamePrompt.innerText = `Where is ${gameState.selectedNote} on the ${gameState.selectedString} string?`;
            }
            else if(gamemode === 'note') {
                let displayFret = fretboard.querySelector(`.string[data-name="${gameState.selectedString}"]`);
                displayFret = displayFret.querySelector(`.note-fret[data-note="${gameState.selectedNote}"]`);
                displayFret.classList.add('note-fret-pink');
                gamePrompt.innerText = `What note does the selected fret produce?`;

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
    
    