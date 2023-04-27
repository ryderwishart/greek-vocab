document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayData('data.csv');
    addEventListeners();
});

function fetchAndDisplayData(filename) {
    fetch(filename)
        .then(response => response.text())
        .then(text => {
            const data = parseCSV(text);

            // Find the maximum frequency value
            const maxFrequency = data.reduce((max, curr) => Math.max(max, curr.freq), 0);

            displayFlashcards(data, maxFrequency);
        })
        .catch(error => console.error(error));
}

function parseCSV(text) {
    return text.trim().split('\n').map(line => {
        const [id, norm, freq, glosses, parseCode] = line.split(',');
        return { id, norm, freq, glosses, parseCode };
    });
}

function displayFlashcards(data, maxFrequency) {
    const container = document.getElementById('flashcards-container');
    data.forEach(flashcardData => {
        const flashcard = createFlashcard(flashcardData, maxFrequency);
        container.appendChild(flashcard);
    });
}

function createFlashcard(cardData, maxFrequency) {
    const card = document.createElement('div');
    card.classList.add('flashcard');

    const frequency = document.createElement('span');
    frequency.classList.add('frequency');
    frequency.textContent = `Frequency: ${cardData.freq}`;
    card.appendChild(frequency);

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
    parseCode.textContent = cardData.parseCode;
    card.appendChild(parseCode);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const greenButton = document.createElement('button');
    greenButton.classList.add('flag-button', 'green');
    // greenButton.textContent = 'Green';
    greenButton.addEventListener('click', () => {
        card.classList.remove('yellow', 'red');
        card.classList.add('green');
    });
    buttonContainer.appendChild(greenButton);

    const yellowButton = document.createElement('button');
    yellowButton.classList.add('flag-button', 'yellow');
    // yellowButton.textContent = 'Yellow';
    yellowButton.addEventListener('click', () => {
        card.classList.remove('green', 'red');
        card.classList.add('yellow');
    });
    buttonContainer.appendChild(yellowButton);

    const redButton = document.createElement('button');
    redButton.classList.add('flag-button', 'red');
    // redButton.textContent = 'Red';
    redButton.addEventListener('click', () => {
        card.classList.remove('green', 'yellow');
        card.classList.add('red');
    });
    buttonContainer.appendChild(redButton);

    // no color button
    const noColorButton = document.createElement('button');
    noColorButton.classList.add('flag-button', 'no-color');
    // noColorButton.textContent = 'No Color';
    noColorButton.addEventListener('click', () => {
        card.classList.remove('green', 'yellow', 'red');
    });
    buttonContainer.appendChild(noColorButton);

    card.appendChild(buttonContainer);

    // Load color from local storage if available
    // Load color and collapsed state from local storage if available
    const storedColor = localStorage.getItem(`card-${cardData.id}-color`);
    const storedCollapsed = localStorage.getItem(`card-${cardData.id}-collapsed`);

    if (storedColor) {
        card.classList.add(storedColor);
    }

    if (storedCollapsed === 'true') {
        card.classList.add('collapsed');
    }

    // Toggle collapsed state
    const toggleCollapsed = () => {
        card.classList.toggle('collapsed');
        localStorage.setItem(`card-${cardData.id}-collapsed`, card.classList.contains('collapsed'));
    };

    norm.addEventListener('click', toggleCollapsed);

    const setColor = (color) => {
        card.classList.remove('green', 'yellow', 'red', 'no-color');
        card.classList.add(color);
        localStorage.setItem(`card-${cardData.id}-color`, color);
    };

    greenButton.addEventListener('click', () => {
        setColor('green');
    });

    yellowButton.addEventListener('click', () => {
        setColor('yellow');
    });

    redButton.addEventListener('click', () => {
        setColor('red');
    });

    noColorButton.addEventListener('click', () => {
        setColor('no-color');
    });

    // Calculate the size factor for the card based on its frequency
    const sizeFactor = 0.5 + (cardData.freq / maxFrequency) * 0.5;

    
    const panel = document.createElement('div');
    panel.classList.add('masonry-layout-panel');
    const panelContent = document.createElement('div');
    panelContent.classList.add('masonry-layout-panel-content');

    panelContent.appendChild(card);
    panel.appendChild(panelContent);
    return panel;
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

        if (e.target.classList.contains('flashcard-reveal')) {
            targetFlashcard = e.target;
        } else if (e.target.parentElement.classList.contains('flashcard-reveal')) {
            targetFlashcard = e.target.parentElement;
        } else if (e.target.parentElement.parentElement.classList.contains('flashcard-reveal')) {
            targetFlashcard = e.target.parentElement.parentElement;
        }

        if (targetFlashcard && targetFlashcard.classList.contains('flashcard-blur')) {
            targetFlashcard.classList.remove('flashcard-blur');
            targetFlashcard.classList.add('flashcard-reveal');
        } else if (targetFlashcard && targetFlashcard.classList.contains('flashcard-reveal')) {
            targetFlashcard.classList.remove('flashcard-reveal');
            targetFlashcard.classList.add('flashcard-blur');
        }
    });

}
