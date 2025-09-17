// Gestion du thème
function setTheme(theme) {
    const newThemeClass = `${theme}-theme`;
    document.body.className = newThemeClass;
    localStorage.setItem('theme', theme);
    if (document.getElementById('toggleViewButtonImg')) {
        const toggleViewButtonImg = document.getElementById('toggleViewButtonImg');
        if (toggleViewButtonImg.to === 'cards') {
            toggleViewButtonImg.src = `/icons/carres-${theme}.png`
        } else if (toggleViewButtonImg.to === 'list') {
            toggleViewButtonImg.src = `/icons/lignes-${theme}.png`
        }
    }
}

const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
if (savedTheme) {
    setTheme(savedTheme);
} else if (prefersLight) {
    setTheme('light');
} else {
    setTheme('dark');
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Fonctions globales :

// Messages --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * Génère et affiche un message d'alerte temporaire.
 *
 * @param {string} message - Le texte du message à afficher.
 * @param {'success' | 'info' | 'warning' | 'error'} type - Le type d'alerte pour le style (e.g., 'success', 'error').
 */
export function showMessage (message, type = 'info') {
    const alertContainer = document.querySelector('.alert-container') || document.createElement('div');
    if (!alertContainer.classList.contains('alert-container')) {
        alertContainer.classList.add('alert-container');
        document.body.appendChild(alertContainer);
    }
    
    const alertBox = document.createElement('div');
    alertBox.className = `alert-box alert-${type}`;
    
    let iconHTML = '';
    switch (type) {
        case 'success':
            iconHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
            break;
        case 'warning':
            iconHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
            break;
        case 'error':
            iconHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>';
            break;
        case 'info':
        default:
            iconHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
            break;
    }

    alertBox.innerHTML = `${iconHTML}<span>${message}</span>`;
    
    alertContainer.appendChild(alertBox);

    setTimeout(() => {
        alertBox.classList.add('show');
    }, 50);

    setTimeout(() => {
        alertBox.classList.remove('show');
        alertBox.classList.add('hide');
    }, 9900);

    setTimeout(() => {
        alertBox.remove();
        if (alertContainer.children.length === 0) {
            alertContainer.remove();
        }
    }, 10400);
}


/** -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * Objet pour afficher différents types de pop-ups.
 * Chaque méthode gère le comportement et l'interface spécifiques.
 */
export const showPopUp = {
    /**
     * Affiche une pop-up de grande taille (pleine page).
     * @param {string} htmlString - Le contenu HTML à afficher.
     */
    big: (htmlString) => {
        const popUpContainer = createPopUpContainer();
        const popUpContent = document.createElement('div');
        popUpContent.classList.add('pop-up-content', 'big-size');
        popUpContent.innerHTML = htmlString;
        
        // Bouton de fermeture
        const closeBtn = document.createElement('noButton');
        closeBtn.classList.add('pop-up-close-btn');
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => closePopUp(popUpContainer);
        popUpContent.appendChild(closeBtn);
        
        popUpContainer.appendChild(popUpContent);
        show(popUpContainer);
    },

    /**
     * Affiche une pop-up de petite taille (ajustée au contenu).
     * @param {string} htmlString - Le contenu HTML à afficher.
     */
    little: (htmlString) => {
        const popUpContainer = createPopUpContainer();
        const popUpContent = document.createElement('div');
        popUpContent.classList.add('pop-up-content', 'little-size');
        popUpContent.innerHTML = htmlString;

        // Fermeture en cliquant sur le fond
        popUpContainer.onclick = (e) => {
            if (e.target === popUpContainer) {
                closePopUp(popUpContainer);
            }
        };

        popUpContainer.appendChild(popUpContent);
        show(popUpContainer);
    },

    /**
     * Affiche une pop-up de confirmation.
     * @param {string} text - Le texte de la confirmation.
     * @returns {Promise<boolean>} Une promesse qui se résout en `true` si l'utilisateur confirme, `false` sinon.
     */
    confirm: (text) => {
        return new Promise((resolve) => {
            const popUpContainer = createPopUpContainer();
            const popUpContent = document.createElement('div');
            popUpContent.classList.add('pop-up-content', 'confirm-size');

            const textElement = document.createElement('p');
            textElement.innerText = text;
            popUpContent.appendChild(textElement);

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('pop-up-buttons');

            // Bouton OK
            const okBtn = document.createElement('button');
            okBtn.innerText = 'OK';
            okBtn.onclick = () => {
                closePopUp(popUpContainer);
                resolve(true);
            };
            
            // Bouton Annuler
            const cancelBtn = document.createElement('button');
            cancelBtn.innerText = 'Annuler';
            cancelBtn.onclick = () => {
                closePopUp(popUpContainer);
                resolve(false);
            };

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(okBtn);
            popUpContent.appendChild(buttonContainer);
            popUpContainer.appendChild(popUpContent);
            show(popUpContainer);
        });
    },

    /**
     * Affiche une pop-up avec des champs de saisie.
     * @param {string} text - Le texte d'introduction.
     * @param {string[]} placeholders - Un tableau de 1 à 3 placeholders pour les champs de saisie.
     * @returns {Promise<string[]>} Une promesse qui se résout avec un tableau des valeurs saisies, ou un tableau vide si annulé.
     */
    textEntry: (text, placeholders) => {
        return new Promise((resolve) => {
            const popUpContainer = createPopUpContainer();
            const popUpContent = document.createElement('div');
            popUpContent.classList.add('pop-up-content', 'text-entry-size');

            const textElement = document.createElement('p');
            textElement.innerText = text;
            popUpContent.appendChild(textElement);

            const inputs = [];
            for (const placeholder of placeholders.slice(0, 3)) {
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = placeholder;
                popUpContent.appendChild(input);
                inputs.push(input);
            }

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('pop-up-buttons');

            // Bouton OK
            const okBtn = document.createElement('button');
            okBtn.innerText = 'OK';
            okBtn.onclick = () => {
                closePopUp(popUpContainer);
                const values = inputs.map(input => input.value);
                resolve(values);
            };
            
            // Bouton Annuler
            const cancelBtn = document.createElement('button');
            cancelBtn.innerText = 'Annuler';
            cancelBtn.onclick = () => {
                closePopUp(popUpContainer);
                resolve([]);
            };

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(okBtn);
            popUpContent.appendChild(buttonContainer);
            popUpContainer.appendChild(popUpContent);
            show(popUpContainer);
        });
    },

    /**
     * Affiche une flashcard avec différents niveaux de difficulté et types de réponses.
     * @param {string} level - Le niveau de difficulté ('easy', 'medium', 'hard', 'extrem').
     * @returns {Promise<object>} Résout avec le score, la réponse correcte, la réponse utilisateur et un booléen `isCorrect`.
     */
    flashCard: async function(level) {
        let sessionScore = 0;
        let cardIndex = 0;
        let scoreInterval = null;

        const startScoreUpdate = () => {
            scoreInterval = setInterval(() => {
                // Logic for a real-time score display (if you had one).
                // This is currently a guardrail as per original code.
            }, 50);
        };

        const stopScoreUpdate = () => {
            if (scoreInterval) {
                clearInterval(scoreInterval);
            }
        };

        const flippCard = () => {
            const element = document.getElementsByClassName('pop-up-content')[0];
            if (element) {
                element.classList.add('retourne');
            }
        };

        const validateFlashcard = (card) => {
            if (!card.question || !card.answer || !card.answer.levelEasy) {
                console.error('Carte invalide : la question ou la réponse facile est manquante.', card);
                return false;
            }
            if (card.answer.levelMedium && card.answer.levelMedium.options) {
                const easyAnswer = card.answer.levelEasy;
                const mediumOptions = card.answer.levelMedium.options.map(opt => opt.toLowerCase());
                if (!mediumOptions.includes(easyAnswer.toLowerCase())) {
                    console.error('Carte invalide : La réponse facile n\'est pas incluse dans les options du niveau moyen.', card);
                    return false;
                }
            }
            return true;
        };

        const showFinalPopUp = (finalScore, finalLevel) => {
            stopScoreUpdate();
            const popUpContainer = createPopUpContainer();
            const popUpContent = document.createElement('div');
            popUpContent.classList.add('pop-up-content', 'confirm-size');

            let message = '';
            let colorClass = '';
            const totalCardsPlayed = cardIndex;

            if (finalLevel === 'easy' || totalCardsPlayed === 0) {
                closePopUp(popUpContainer);
                return;
            }

            const scorePercent = (finalScore / totalCardsPlayed) * 100;
            if (scorePercent >= 80) {
                message = `Excellent ! Vous avez obtenu un score de ${finalScore}/${totalCardsPlayed}. Vous êtes un maître des flashcards !`;
                colorClass = 'correct';
            } else if (scorePercent >= 50) {
                message = `Bon travail ! Votre score est de ${finalScore}/${totalCardsPlayed}. Continuez comme ça !`;
                colorClass = 'passed';
            } else {
                message = `Votre score est de ${finalScore}/${totalCardsPlayed}. Ne vous découragez pas, la pratique mène à la perfection !`;
                colorClass = 'incorrect';
            }

            const messageEl = document.createElement('h3');
            messageEl.innerText = `Session terminée (${finalLevel.charAt(0).toUpperCase() + finalLevel.slice(1)})`;
            const scoreEl = document.createElement('p');
            scoreEl.innerHTML = message;

            const closeBtn = document.createElement('button');
            closeBtn.innerText = 'Fermer';
            closeBtn.onclick = () => {
                closePopUp(popUpContainer);
            };

            popUpContent.classList.add(colorClass);
            popUpContent.appendChild(messageEl);
            popUpContent.appendChild(scoreEl);
            popUpContent.appendChild(closeBtn);
            popUpContainer.appendChild(popUpContent);
            show(popUpContainer);
        };

        return new Promise(async function(resolve) {
            let flashcardsJSON;
            try {
                const response = await fetch('cards.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const allFlashcards = Object.values(data);
                const validFlashcards = allFlashcards.filter(validateFlashcard);

                if (validFlashcards.length === 0) {
                    console.error('Aucune flashcard valide n\'a été trouvée.');
                    return resolve({ score: 0, isCorrect: false, userResponse: null, correctResponse: null });
                }
                flashcardsJSON = validFlashcards;
            } catch (error) {
                console.error('Failed to fetch or parse cards.json:', error);
                return resolve({ score: 0, isCorrect: false, userResponse: null, correctResponse: null });
            }

            const flashcards = flashcardsJSON;
            const shuffledFlashcards = flashcards.sort(() => 0.5 - Math.random());

            const startFlashcardSession = () => {
                if (cardIndex >= shuffledFlashcards.length) {
                    showFinalPopUp(sessionScore, level);
                    return;
                }

                const card = shuffledFlashcards[cardIndex];
                const popUpContainer = createPopUpContainer();
                const popUpContent = document.createElement('div');
                popUpContent.classList.add('pop-up-content', 'flashcard-size');

                const exitBtn = document.createElement('button');
                exitBtn.innerText = 'Quitter';
                exitBtn.classList.add('exit-button');
                exitBtn.onclick = () => {
                    closePopUp(popUpContainer);
                    showFinalPopUp(sessionScore, level);
                };

                popUpContent.appendChild(exitBtn);

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                popUpContent.appendChild(cardBody);

                let hasAnswered = false;
                let helpUsed = false;

                const checkAnswer = (currentLevel, userResponse) => {
                    let isCorrect = false;
                    const correctResponse = card.answer.levelEasy;
                    const cleanUserResponse = userResponse ? userResponse.toLowerCase().trim() : '';
                    const cleanCorrectResponse = correctResponse.toLowerCase().trim();

                    const levenshteinDistance = (a, b) => {
                        if (a.length === 0) return b.length;
                        if (b.length === 0) return a.length;
                        const matrix = [];
                        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
                        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
                        for (let i = 1; i <= b.length; i++) {
                            for (let j = 1; j <= a.length; j++) {
                                const cost = (b.charAt(i - 1) === a.charAt(j - 1)) ? 0 : 1;
                                matrix[i][j] = Math.min(
                                    matrix[i - 1][j - 1] + cost,
                                    matrix[i][j - 1] + 1,
                                    matrix[i - 1][j] + 1
                                );
                            }
                        }
                        return matrix[b.length][a.length];
                    };

                    switch (currentLevel) {
                        case 'medium':
                            const selected = document.querySelector('input[name="flashcard-choice"]:checked');
                            if (selected) {
                                userResponse = selected.value;
                                isCorrect = userResponse === cleanCorrectResponse;
                            }
                            break;
                        case 'hard':
                            userResponse = cleanUserResponse;
                            const distanceHard = levenshteinDistance(userResponse, cleanCorrectResponse);
                            const maxErrorHard = Math.floor(cleanCorrectResponse.length / 5);
                            isCorrect = distanceHard <= maxErrorHard;
                            break;
                        case 'extrem':
                            userResponse = cleanUserResponse;
                            isCorrect = userResponse === cleanCorrectResponse;
                            break;
                        default:
                            isCorrect = false;
                            break;
                    }
                    return { isCorrect, userResponse, correctResponse };
                };

                const showResult = (result, passed = false) => {
                    if (hasAnswered) return;
                    hasAnswered = true;

                    const popUpContent = document.querySelector('.pop-up-content');
                    popUpContent.classList.add('retourne');

                    const backCardBody = document.createElement('div');
                    backCardBody.classList.add('card-body', 'back');

                    const exitBTN = document.getElementsByClassName('exit-button')[0];
                    exitBTN.classList.add('back');

                    if (level === 'easy') {
                        const answerHeading = document.createElement('h3');
                        answerHeading.innerText = card.answer.levelEasy;
                        backCardBody.appendChild(answerHeading);

                        const questionP = document.createElement('p');
                        questionP.classList.add('question-small');
                        questionP.innerText = card.question;
                        backCardBody.appendChild(questionP);

                        if (card['fun-fact']) {
                            const funFact = document.createElement('p');
                            funFact.classList.add('fun-fact');
                            funFact.innerHTML = `Le saviez-vous ? ${card['fun-fact']}`;
                            backCardBody.appendChild(funFact);
                        }
                    } else {
                        let resultClass;
                        let resultText;
                        if (passed) {
                            resultClass = 'passed';
                            resultText = 'Passé';
                        } else if (result.isCorrect) {
                            resultClass = 'correct';
                            resultText = 'Correct !';
                            if (!helpUsed) {
                                sessionScore++;
                            } else {
                                sessionScore += 0.5;
                            }
                        } else {
                            resultClass = 'incorrect';
                            resultText = 'Faux.';
                        }

                        popUpContent.classList.add(resultClass);

                        const heading = document.createElement('h3');
                        heading.innerText = resultText;
                        backCardBody.appendChild(heading);

                        const correction = document.createElement('p');
                        correction.classList.add('correction');
                        correction.innerHTML = `La bonne réponse est : <span class="correct-answer">${card.answer.levelEasy}</span>`;
                        backCardBody.appendChild(correction);

                        if (card['fun-fact'] && !passed) {
                            const funFact = document.createElement('p');
                            funFact.classList.add('fun-fact');
                            funFact.innerHTML = `Le saviez-vous ? ${card['fun-fact']}`;
                            backCardBody.appendChild(funFact);
                        }
                    }

                    const nextBtn = document.createElement('button');
                    nextBtn.innerText = 'Suivant';
                    nextBtn.classList.add('next-button');
                    nextBtn.onclick = () => {
                        cardIndex++;
                        closePopUp(popUpContainer);
                        startFlashcardSession();
                    };
                    backCardBody.appendChild(nextBtn);

                    const existingCardBody = document.querySelector('.card-body');
                    existingCardBody.parentNode.replaceChild(backCardBody, existingCardBody);
                };

                const displayQuestion = () => {
                    cardBody.innerHTML = '';

                    const question = document.createElement('h3');
                    question.innerText = card.question;
                    cardBody.appendChild(question);

                    if (level === 'easy') {
                        cardBody.onclick = () => {
                            flippCard();
                            showResult({});
                            cardBody.onclick = null;
                        };
                    } else {
                        const answerContainer = document.createElement('div');
                        answerContainer.classList.add('flashcard-answer-container');
                        let inputElement;

                        if (level === 'medium') {
                            const options = card.answer.levelMedium.options;
                            options.forEach((choice, index) => {
                                const radioWrapper = document.createElement('div');
                                radioWrapper.classList.add('radio-wrapper');
                                const radio = document.createElement('input');
                                radio.type = 'radio';
                                radio.id = `choice-${index}`;
                                radio.name = 'flashcard-choice';
                                radio.value = choice.toLowerCase();
                                const label = document.createElement('label');
                                label.htmlFor = `choice-${index}`;
                                label.innerText = choice;
                                radioWrapper.appendChild(radio);
                                radioWrapper.appendChild(label);
                                answerContainer.appendChild(radioWrapper);
                            });
                        } else if (level === 'hard' || level === 'extrem') {
                            inputElement = document.createElement('input');
                            inputElement.type = 'text';
                            inputElement.placeholder = "Votre réponse...";
                            inputElement.addEventListener('keyup', (e) => {
                                if (e.key === 'Enter' && inputElement.value.trim() !== '') {
                                    submitBtn.click();
                                }
                            });
                            answerContainer.appendChild(inputElement);
                        }
                        cardBody.appendChild(answerContainer);

                        const buttonsDiv = document.createElement('div');
                        buttonsDiv.classList.add('flashcard-buttons-container');

                        const submitBtn = document.createElement('button');
                        submitBtn.innerText = 'Valider';
                        submitBtn.onclick = () => {
                            let userResponse = '';
                            if (level === 'medium') {
                                const selected = document.querySelector('input[name="flashcard-choice"]:checked');
                                if (selected) {
                                    userResponse = selected.value;
                                }
                            } else {
                                userResponse = inputElement.value;
                            }
                            const result = checkAnswer(level, userResponse);
                            flippCard();
                            showResult(result);
                        };
                        buttonsDiv.appendChild(submitBtn);

                        const passBtn = document.createElement('button');
                        passBtn.innerText = 'Passer';
                        passBtn.classList.add('pass-button');
                        passBtn.onclick = () => {
                            flippCard();
                            showResult({ isCorrect: false, userResponse: null, correctResponse: card.answer.levelEasy }, true);
                        };
                        buttonsDiv.appendChild(passBtn);

                        if (card.help) {
                            const helpBtn = document.createElement('button');
                            helpBtn.innerText = 'Aide';
                            helpBtn.classList.add('help-button');
                            helpBtn.onclick = () => {
                                const helpText = document.createElement('p');
                                helpText.classList.add('flashcard-help');
                                helpText.innerText = card.help;
                                cardBody.appendChild(helpText);
                                helpBtn.disabled = true;
                                helpUsed = true;
                            };
                            buttonsDiv.appendChild(helpBtn);
                        }
                        cardBody.appendChild(buttonsDiv);
                    }

                    if (card['always-help'] && Array.isArray(card['always-help']) && card['always-help'].length >= 2) {
                        const alwaysHelpContent = card['always-help'][0];
                        const levelConfig = card['always-help'][1];
                        if (levelConfig[level] === true) {
                            const alwaysHelpText = document.createElement('p');
                            alwaysHelpText.classList.add('flashcard-always-help');
                            alwaysHelpText.innerText = alwaysHelpContent;
                            cardBody.appendChild(alwaysHelpText);
                        }
                    }
                };

                popUpContainer.appendChild(popUpContent);
                show(popUpContainer);
                displayQuestion();
            };

            startScoreUpdate();
            startFlashcardSession();
        });
    }
}

/**
 * Crée une chaîne JSON pour une nouvelle flashcard.
 * @returns {function} Une fonction qui, une fois appelée, affichera le formulaire.
 */
export function manageFlashCard(link) {
    return async () => {
        let currentData = {};

        const loadFlashcards = async () => {
            try {
                const response = await fetch(link);//// LINK À MODIFIER!!!!
                if (!response.ok) throw new Error('Impossible de charger '+ link);
                currentData = await response.json();
                renderUI();
                showMessage(`Flashcards chargées depuis ${link}`, "success");
            } catch (error) {
                console.error("Erreur de chargement initial :", error);
                const importHTML = `
                    <h3>Importer vos flashcards</h3>
                    <p>Le fichier ${link} n'a pas pu être chargé. Veuillez coller votre JSON ci-dessous.</p>
                    <textarea id="json-paste-area" placeholder="Collez votre JSON ici..."></textarea>
                    <button id="import-json-btn">Importer le JSON</button>
                    <p>Ou <a href="#" id="create-new-link">créer de nouvelles flashcards</a>.</p>
                `;
                showPopUp.big(importHTML);

                document.getElementById('import-json-btn').addEventListener('click', () => {
                    try {
                        const jsonText = document.getElementById('json-paste-area').value;
                        currentData = JSON.parse(jsonText);
                        showPopUp.close();
                        renderUI();
                        showMessage("JSON importé avec succès !", "success");
                    } catch (e) {
                        showMessage("Format JSON invalide. Veuillez vérifier votre code.", "error");
                    }
                });

                document.getElementById('create-new-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    showPopUp.close();
                    currentData = {};
                    renderUI();
                    showMessage("Commencez à créer de nouvelles flashcards !", "info");
                });
            }
        };

        const renderUI = () => {
            const cardsHtml = Object.keys(currentData).map(key => {
                const card = currentData[key];
                return `
                    <div class="existing-card" data-id="${key}">
                        <h4>Carte #${key}</h4>
                        <p class="card-question"><strong>Q:</strong> ${card.question}</p>
                        <button class="edit-card-btn">Modifier</button>
                    </div>
                `;
            }).join('');

            const formHTML = `
                <div class="flashcard-scroll-container">
                    <h3>Gérer les flashcards</h3>
                    <div class="existing-cards-container">
                        ${cardsHtml}
                    </div>
                    <button id="create-new-card-btn">Créer une nouvelle flashcard</button>
                    
                    <div id="flashcard-form" style="display:none;">
                        <h4>Nouvelle/Modification de flashcard</h4>
                        <label for="question">Question :</label>
                        <input type="text" id="question" name="question" required>
                        <label for="help">Aide :</label>
                        <input type="text" id="help" name="help">
                        <label for="fun-fact">Anecdote (Fun Fact) :</label>
                        <input type="text" id="fun-fact" name="fun-fact">
                        
                        <div class="always-help-section">
                            <label for="always-help-text">Aide permanente (texte) :</label>
                            <input type="text" id="always-help-text" name="always-help-text">
                            <label>Afficher pour les niveaux :</label>
                            <div class="always-help-levels">
                                <label><input type="checkbox" name="always-help-level" value="easy"> Facile</label>
                                <label><input type="checkbox" name="always-help-level" value="medium"> Moyen</label>
                                <label><input type="checkbox" name="always-help-level" value="hard"> Difficile</label>
                                <label><input type="checkbox" name="always-help-level" value="extrem"> Extrême</label>
                            </div>
                        </div>
                        
                        <div class="answer-section">
                            <h5>Réponses par niveau</h5>
                            <label for="levelEasy">Réponse Facile :</label>
                            <input type="text" id="levelEasy" name="levelEasy">
                            <label for="levelMediumOptions">Options du QCM (séparées par des virgules) :</label>
                            <input type="text" id="levelMediumOptions" name="levelMediumOptions" placeholder="ex: Paris,Londres,New York">
                        </div>
                        
                        <button id="add-or-update-btn">Ajouter la carte</button>
                        <button id="delete-card-btn" style="display:none;">Supprimer la carte</button>
                    </div>

                    <div class="result-container">
                        <button id="copy-json-btn">Copier le JSON</button>
                    </div>
                </div>
            `;

            showPopUp.big(formHTML);

            const flashcardForm = document.getElementById('flashcard-form');
            const questionInput = document.getElementById('question');
            const helpInput = document.getElementById('help');
            const funFactInput = document.getElementById('fun-fact');
            const alwaysHelpTextInput = document.getElementById('always-help-text');
            const alwaysHelpLevelInputs = document.querySelectorAll('input[name="always-help-level"]');
            const levelEasyInput = document.getElementById('levelEasy');
            const levelMediumOptionsInput = document.getElementById('levelMediumOptions');
            const addOrUpdateBtn = document.getElementById('add-or-update-btn');
            const deleteCardBtn = document.getElementById('delete-card-btn');
            const copyJsonBtn = document.getElementById('copy-json-btn');
            let editingCardId = null;

            const loadCardForEditing = (cardId) => {
                editingCardId = cardId;
                const card = currentData[cardId];
                questionInput.value = card.question || '';
                helpInput.value = card.help || '';
                funFactInput.value = card['fun-fact'] || '';
                levelEasyInput.value = card.answer?.levelEasy || '';
                levelMediumOptionsInput.value = card.answer?.levelMedium?.options?.join(',') || '';
                
                // Gestion de l'aide permanente
                if (card['always-help'] && Array.isArray(card['always-help']) && card['always-help'].length >= 2) {
                    alwaysHelpTextInput.value = card['always-help'][0];
                    const levelConfig = card['always-help'][1];
                    alwaysHelpLevelInputs.forEach(input => {
                        input.checked = levelConfig[input.value] || false;
                    });
                } else {
                    alwaysHelpTextInput.value = '';
                    alwaysHelpLevelInputs.forEach(input => {
                        input.checked = false;
                    });
                }

                addOrUpdateBtn.textContent = "Mettre à jour la carte";
                deleteCardBtn.style.display = 'inline-block';
                flashcardForm.style.display = 'block';
            };

            document.querySelectorAll('.edit-card-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const cardId = e.target.closest('.existing-card').dataset.id;
                    loadCardForEditing(cardId);
                });
            });

            document.getElementById('create-new-card-btn').addEventListener('click', () => {
                editingCardId = null;
                questionInput.value = '';
                helpInput.value = '';
                funFactInput.value = '';
                alwaysHelpTextInput.value = '';
                levelEasyInput.value = '';
                levelMediumOptionsInput.value = '';
                alwaysHelpLevelInputs.forEach(input => {
                    input.checked = (input.value !== 'easy');
                });
                addOrUpdateBtn.textContent = "Ajouter la carte";
                deleteCardBtn.style.display = 'none';
                flashcardForm.style.display = 'block';
            });

            addOrUpdateBtn.addEventListener('click', () => {
                const question = questionInput.value.trim();
                const help = helpInput.value.trim();
                const funFact = funFactInput.value.trim();
                const alwaysHelpText = alwaysHelpTextInput.value.trim();
                const levelEasy = levelEasyInput.value.trim();
                const levelMediumOptions = levelMediumOptionsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);

                if (!question || !levelEasy) {
                    showMessage("La question et la réponse facile sont obligatoires.", "error");
                    return;
                }
                
                const answerObject = {};
                answerObject.levelEasy = levelEasy;
                
                if (levelMediumOptions.length > 0) {
                    answerObject.levelMedium = { options: levelMediumOptions };
                }

                let alwaysHelp = [];
                if (alwaysHelpText) {
                    const alwaysHelpLevels = {
                        easy: document.querySelector('input[name="always-help-level"][value="easy"]').checked,
                        medium: document.querySelector('input[name="always-help-level"][value="medium"]').checked,
                        hard: document.querySelector('input[name="always-help-level"][value="hard"]').checked,
                        extrem: document.querySelector('input[name="always-help-level"][value="extrem"]').checked
                    };
                    alwaysHelp = [alwaysHelpText, alwaysHelpLevels];
                }

                const newCard = {
                    question,
                    answer: answerObject,
                    'fun-fact': funFact || undefined,
                    help: help || undefined,
                    'always-help': alwaysHelp.length > 0 ? alwaysHelp : undefined
                };

                const cardId = editingCardId || (Object.keys(currentData).length + 1).toString();
                currentData[cardId] = newCard;
                showMessage(`Flashcard ${editingCardId ? 'mise à jour' : 'ajoutée'} avec succès !`, "success");
                
                renderUI();
            });

            deleteCardBtn.addEventListener('click', () => {
                if (editingCardId && confirm(`Êtes-vous sûr de vouloir supprimer la carte #${editingCardId} ?`)) {
                    delete currentData[editingCardId];
                    showMessage(`Flashcard #${editingCardId} supprimée.`, "info");
                    renderUI();
                }
            });

            copyJsonBtn.addEventListener('click', () => {
                const jsonContent = JSON.stringify(currentData, null, 4);
                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(jsonContent)
                            .then(() => showMessage("JSON copié dans le presse-papiers !", "success"))
                            .catch(err => {
                                console.error("Erreur de l'API Clipboard :", err);
                                fallbackCopy(jsonContent);
                            });
                    } else {
                        fallbackCopy(jsonContent);
                    }
                } catch (err) {
                    console.error("Erreur inattendue :", err);
                    fallbackCopy(jsonContent);
                }
            });

            function fallbackCopy(text) {
                const tempTextarea = document.createElement('textarea');
                tempTextarea.value = text;
                tempTextarea.style.position = 'fixed';
                tempTextarea.style.opacity = '0';
                document.body.appendChild(tempTextarea);
                tempTextarea.focus();
                tempTextarea.select();

                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        showMessage("JSON copié dans le presse-papiers (via fallback) !", "success");
                    } else {
                        showMessage("Impossible de copier le JSON. Veuillez le sélectionner et le copier manuellement.", "error");
                    }
                } catch (err) {
                    console.error('Erreur de la commande de copie de secours :', err);
                    showMessage("Impossible de copier le JSON. Veuillez le sélectionner et le copier manuellement.", "error");
                }

                document.body.removeChild(tempTextarea);
            }
        };

        loadFlashcards();
    };
}

// --- Fonctions utilitaires ---
function createPopUpContainer() {
    const popUpContainer = document.createElement('div');
    popUpContainer.classList.add('pop-up-container');
    return popUpContainer;
}
function show(container) {
    document.body.appendChild(container);
    document.body.classList.add('no-scroll');
}
function closePopUp(container) {
    document.body.classList.remove('no-scroll');
    container.remove();
}
