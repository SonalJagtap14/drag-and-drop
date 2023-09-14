document.addEventListener('DOMContentLoaded', function () {
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const wordBoxes = Array.from(document.getElementsByClassName('word-box'));
    const mainImage = document.getElementById('main-image');
    const speakerIcon = document.getElementById('speaker-icon');
    const alphabetContainer = document.querySelector('.alphabet-container');
    console.log(alphabets);
    let draggedElement = null;
    let correctWord = "";
    let missingIndex = null;

    function loadNewQuestion() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const randomQuestion = data.questions[Math.floor(Math.random() * data.questions.length)];   // will store obj
                correctWord = randomQuestion.word;      //obj.(its-prop)
                mainImage.src = randomQuestion.img;
                speakerIcon.dataset.audio = randomQuestion.audio;

                missingIndex = Math.floor(Math.random() * correctWord.length);  //betw 0 & len(correct-word)
                console.log(missingIndex)
                wordBoxes.forEach((box, idx) => {        //display word in boxes
                    box.style.backgroundColor = '';
                    if (idx === missingIndex) {
                        box.textContent = '';
                    } else {
                        box.textContent = correctWord[idx];
                    }
                });
            })
            .catch(error => {
                console.error("Error in fetching the JSON data:", error);
            });
    }
    // audiooo part
    speakerIcon.addEventListener('click', function () {
        const audioSrc = speakerIcon.dataset.audio;
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play();
        }
    });
    //    
    //

    function renderAlphabets() {
        alphabets.forEach(letter => {
            const letterEl = document.createElement('div');
            letterEl.classList.add('alphabet-letter');
            letterEl.textContent = letter;

            letterEl.addEventListener('mousedown', function (e) {
                draggedElement = letterEl;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            alphabetContainer.appendChild(letterEl);
        });
    }

    function onMouseMove(e) {
        if (draggedElement) {
            draggedElement.style.position = 'absolute';
            draggedElement.style.left = e.pageX - 20 + 'px'; // 20px to center cursor
            draggedElement.style.top = e.pageY - 20 + 'px';
        }
    }

    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (draggedElement) {
            wordBoxes.forEach(box => {
                const boxRect = box.getBoundingClientRect();
                if (
                    e.pageX > boxRect.left &&
                    e.pageX < boxRect.right &&
                    e.pageY > boxRect.top &&
                    e.pageY < boxRect.bottom
                ) {
                    box.textContent = draggedElement.textContent;

                    if (draggedElement.textContent === correctWord[missingIndex]) {
                        //
                        //to change color
                        //
                        box.style.backgroundColor = 'green';
                        checkAnswer();
                    } else {
                        //if incorrect
                        box.style.backgroundColor = 'red';
                    }
                    //
                }
            });

            // Reset the position of the dragged element
            draggedElement.style.position = '';
            draggedElement.style.left = '';
            draggedElement.style.top = '';
            draggedElement = null;
        }
    }

    function checkAnswer() {
        //  if (wordBoxes[missingIndex].textContent === correctWord[missingIndex]) {
        setTimeout(() => {  // Adding a delay so user can see the green box before the alert
            alert("Correct! Well done ✌✔🏆🥇");
            loadNewQuestion(); //to load new ques once popup is done
        }, 500);
        //  }
    }

    wordBoxes.forEach(box => {
        box.addEventListener('click', function () {
            box.textContent = '';
            box.style.backgroundColor = ''; // Reset the bg-color
        });
    });

    renderAlphabets();
    loadNewQuestion();  // Initial question loading
});
//