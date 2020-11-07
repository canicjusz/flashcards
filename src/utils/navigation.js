import naviboard from 'naviboard';
import store from '../store/index.js'

const { commit, dispatch, state } = store
const inputs = document.querySelectorAll('.addDeck__input, .addFlashcard__input, .addFlashcard__checkbox, .editFlashcard__checkbox')

function handleKeydown(e){
    const element = naviboard.getActiveElement(), classes = element.className, section = document.querySelector('.section--active')
    switch(e.key){
        case 'Enter':
            e.preventDefault()
            center(element, classes)
            break;
        case 'SoftLeft':
            e.preventDefault()
            left(element, classes)
            break;
        case 'ArrowDown':
        case 'ArrowUp':
            section.scrollTop += element.getBoundingClientRect().top - 88
            commit('setSoftkeys', classes)
            break;
        case 'SoftRight':
            e.preventDefault()
            right(element, classes)
            break;
        case 'Backspace':
            if(state.activeSection === 'decks'){
                history.back()
            }else if(element.tagName !== 'INPUT' || (element.selectionStart === 0 && element.value === '')){
                e.preventDefault()
                backspace(classes)
            }
            break;
    }
}

function left(element, classes){
    switch(classes){
        case 'flashcards__item flashcards__flashcard navigable':
        case 'flashcards__item flashcards__flashcard navigable flashcards__flashcard--flipped':
        case 'flashcards__item flashcards__item-adder navigable':
            dispatch('getTrainingFlashcards')
            break;
        case 'train__flashcard navigable train__flashcard--flipped':
            dispatch('processTrainingFlashcard', 'wrong')
            element.classList.remove('train__flashcard--flipped')
            break;
        case 'decks__item navigable':
            commit('changeCurrentDeck', element.textContent)
            dispatch('changeSection', 'deckSettings')
            break;
    }
}

function center(element, classes){
    switch(classes){
        case 'decks__item decks__item-adder navigable':
            dispatch('changeSection', 'addDeck')
            break;
        case 'decks__item navigable':
            commit('changeCurrentDeck', element.textContent)
            dispatch('loadFlashcards')
            break;
        case 'flashcards__item flashcards__item-adder navigable':
            dispatch('changeSection', 'addFlashcard')
            break;
        case 'addFlashcard__label navigable':
            element.querySelector('.addFlashcard__checkbox').click()
            break;
        case 'editFlashcard__label navigable':
            element.querySelector('.editFlashcard__checkbox').click()
            break;
        case 'flashcards__item flashcards__flashcard navigable':
        case 'flashcards__item flashcards__flashcard navigable flashcards__flashcard--flipped':
            element.classList.toggle('flashcards__flashcard--flipped')
            break;
        case 'train__flashcard navigable':
        case 'train__flashcard navigable train__flashcard--flipped':
            element.classList.toggle('train__flashcard--flipped')
            commit('setSoftkeys')
            break;
        default:
            element.click()
    }
}

function right(element, classes){
    switch(classes){
        case 'decks__item navigable':
            commit('changeCurrentDeck', '')
            dispatch('changeSection', 'editDeck')
            setTimeout(()=>{
                commit('changeCurrentDeck', element.textContent)
            }, 10)
            break;
        case 'flashcards__item flashcards__flashcard navigable':
        case 'flashcards__item flashcards__flashcard navigable flashcards__flashcard--flipped':
            commit('changeCurrentFlashcard', '')
            dispatch('changeSection', 'editFlashcard')
            setTimeout(()=>{
                commit('changeCurrentFlashcard', 
                {front:element.querySelector('.flashcards__flashcard-front').textContent, 
                back: element.querySelector('.flashcards__flashcard-back').textContent})
            }, 10)
            break;
        case 'train__flashcard navigable train__flashcard--flipped':
            element.classList.remove('train__flashcard--flipped')
            dispatch('processTrainingFlashcard', 'good')
            break;
    }
}

function backspace(classes){
    for(let i = inputs.length; i--;){
        inputs[i].value = ''
        inputs[i].checked = false
    }
    switch(classes){
        case 'addDeck__input navigable':
        case 'addDeck__button navigable addDecks__item-add':
        case 'addDeck__button navigable':
        case 'editDeck__input navigable':
        case 'editDeck__button editDeck__button-add navigable':
        case 'editDeck__button editDeck__button-remove navigable':
        case 'editDeck__button navigable':
        case 'flashcards__item flashcards__flashcard navigable':
        case 'flashcards__item flashcards__item-adder navigable':
        case 'flashcards__item flashcards__flashcard navigable flashcards__flashcard--flipped':
        case 'deckSettings__button navigable':
            dispatch('changeSection', 'decks')
            break;
        case 'addFlashcard__input navigable':
        case 'addFlashcard__label navigable':
        case 'addFlashcard__button addFlashcard__button-add navigable':
        case 'addFlashcard__button navigable':
        case 'editFlashcard__input navigable':
        case 'editFlashcard__label navigable':
        case 'editFlashcard__button editFlashcard__button-edit navigable':
        case 'editFlashcard__button editFlashcard__button-remove navigable':
        case 'editFlashcard__button navigable':
        case 'train__flashcard navigable':
        case 'train__flashcard navigable train__flashcard--flipped':
            dispatch('changeSection', 'flashcards')
            break;
    }
}

export default document.addEventListener('keydown', handleKeydown)