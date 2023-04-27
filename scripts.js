document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayData('data.csv');
    addEventListeners();
});

function fetchAndDisplayData(filename) {
    fetch(filename)
        .then(response => response.text())
        .then(text => {
            const data = parseCSV(text);
            displayFlashcards(data);
        })
        .catch(error => console.error(error));
}

function parseCSV(text) {
    return text.trim().split('\n').map(line => {
        const [id, norm, freq, glosses, parseCode] = line.split(',');
        return { id, norm, freq, glosses, parseCode };
    });
}

function displayFlashcards(data) {
    const container = document.getElementById('flashcards-container');
    data.forEach(flashcardData => {
        const flashcard = createFlashcard(flashcardData);
        container.appendChild(flashcard);
    });
}

// function createFlashcard({ norm, glosses, parseCode }) {
//     const flashcard = document.createElement('div');
//     flashcard.classList.add('flashcard', 'flashcard-blur');

//     const front = document.createElement('div');
//     front.textContent = norm;
//     flashcard.appendChild(front);

//     const back = document.createElement('div');
//     back.innerHTML = `${glosses}<br>${parseCode}`;
//     flashcard.appendChild(back);

//     return flashcard;
// }

function createFlashcard(cardData) {
    const card = document.createElement('div');
    card.classList.add('flashcard');
  
    const frequency = document.createElement('span');
    frequency.classList.add('frequency');
    frequency.textContent = `Frequency: ${cardData.freq}`;
    card.appendChild(frequency);
    // set frequency to display none 
    
  
    const norm = document.createElement('p');
    norm.classList.add('norm');
    norm.textContent = cardData.norm + ' (' + cardData.freq + 'x)';
    card.appendChild(norm);
  
    const glosses = document.createElement('p');
    glosses.classList.add('flashcard-blur', 'flashcard-reveal');
    glosses.textContent = cardData.glosses;
    card.appendChild(glosses);
  
    const parseCode = document.createElement('p');
    parseCode.classList.add('flashcard-blur', 'flashcard-reveal');
    parseCode.textContent = cardData.parse_code;
    card.appendChild(parseCode);
  
    return card;
  }
  

function addEventListeners() {
    const filterForm = document.getElementById('filter-form');
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Filtering...');
        // Add filtering functionality here
    });

    document.addEventListener('click', (e) => {
        let targetFlashcard;

        if (e.target.classList.contains('flashcard-blur')) {
            targetFlashcard = e.target;
        } else if (e.target.parentElement.classList.contains('flashcard-blur')) {
            targetFlashcard = e.target.parentElement;
        } else if (e.target.parentElement.parentElement.classList.contains('flashcard-blur')) {
            targetFlashcard = e.target.parentElement.parentElement;
        }

        if (targetFlashcard) {
            targetFlashcard.classList.remove('flashcard-blur');
            targetFlashcard.classList.add('flashcard-reveal');
        }
    });

}
