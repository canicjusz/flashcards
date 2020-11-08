import { createStore } from 'vuex'
import naviboard from 'naviboard';
import Dexie from 'dexie';

const db = new Dexie('flashcards');
db.version(1).stores({
  decks: 'name, flashcards'
});

export default createStore({
  state: {
    feedbackTimeout: undefined,
    errorTimeout: undefined,
    activeSection: 'decks',
    currentDeck: '',
    currentFlashcard: {front: '', back: ''},
    decks: [],
    flashcards: [{front: '', back: ''}],
    trainingFlashcards: [{front: '', back: ''}],
    error: '',
    showError: false,
    feedback: '',
    showFeedback: false,
    softkeys: {left: '', center: 'SELECT', right: ''}
  },
  mutations: {
    setActiveSection(state, value){
      state.activeSection = value
    },
    changeError(state, value){
      state.error = value
    },
    changeErrorVisibility(state, bool){
      state.showError = bool
    },
    changeFeedback(state, value){
      state.feedback = value
    },
    changeFeedbackVisibility(state, bool){
      state.showFeedback = bool
    },
    setDecks(state, arr){
      state.decks = arr
    },
    addDeck(state, object){
      state.decks.push(object)
    },
    changeCurrentDeck(state, name){
      state.currentDeck = name
    },
    setFlashcards(state, arr){
      state.flashcards = arr
    },
    changeCurrentFlashcard(state, names){
      state.currentFlashcard = names
    },
    addFlashcard(state, obj){
      state.flashcards.push(obj)
    },
    addTrainingFlashcards(state, arr){
      state.trainingFlashcards = arr
    },
    removeTrainingFlashcards(state){
      state.trainingFlashcards.shift()
    },
    insertTrainingFlashcard(state, flashcard){
      state.trainingFlashcards.splice(5, 0, flashcard)
    },
    setSoftkeys(state, classes = naviboard.getActiveElement().className){
      switch(classes){
        case 'decks__item navigable':
          state.softkeys = {left: 'Settings', center: 'SELECT', right: 'Edit'}
          break;
        case 'addDeck__button navigable addDecks__item-add':
        case 'deckSettings__button navigable':
        case 'addDeck__button navigable':
        case 'editDeck__button editDeck__button-add navigable':
        case 'editDeck__button editDeck__button-remove navigable':
        case 'editDeck__button navigable':
        case 'decks__item decks__item-adder navigable':
        case 'addFlashcard__label navigable':
        case 'addFlashcard__button addFlashcard__button-add':
        case 'addFlashcard__button navigable':
        case 'editFlashcard__label navigable':
        case 'editFlashcard__button editFlashcard__button-edit navigable':
        case 'editFlashcard__button editFlashcard__button-remove navigable':
        case 'editFlashcard__button navigable':
          state.softkeys = {left: '', center: 'SELECT', right: ''}
          break;
        case 'train__flashcard navigable':
          state.softkeys = {left: '', center: 'FLIP', right: ''}
          break;
        case 'train__flashcard navigable train__flashcard--flipped':
          state.softkeys = {left: 'Wrong', center: 'FLIP', right: 'Good'}
          break;
        case 'addDeck__input navigable':
        case 'editDeck__input navigable':
        case 'addFlashcard__input navigable':
        case 'editFlashcard__input navigable':
          state.softkeys = {left: '', center: '', right: ''}
          break;
        case 'flashcards__item flashcards__item-adder navigable':
          state.softkeys = {left: 'Train', center: 'SELECT', right: ''}
          break;
        case 'flashcards__item flashcards__flashcard navigable':
        case 'flashcards__item flashcards__flashcard navigable flashcards__flashcard--flipped':
          state.softkeys = {left: 'Train', center: 'FLIP', right: 'Edit'}
          break;
      }
    }
  },
  actions: {
    changeSection({state,commit}, value){
      document.querySelector('#'+state.activeSection).classList.remove('section--active')
      naviboard.destroyNavigation(state.activeSection)
      commit('setActiveSection', value)
      document.querySelector('#'+value).classList.add('section--active')
      naviboard.setNavigation(value)
      let timeout = setInterval(()=>{
        let activeElement = naviboard.getActiveElement()
        if(activeElement){
          commit('setSoftkeys', activeElement.className)
          clearInterval(timeout)
        }
      }, 10)
    },
    updateDecks({state,commit}, value){
      commit('setDecks', value)
      if(state.activeSection !== 'decks'){
        document.querySelector('#'+state.activeSection).classList.remove('section--active')
        naviboard.destroyNavigation(state.activeSection)
        commit('setActiveSection', value)
      }
      document.querySelector('#decks').classList.add('section--active')
      naviboard.setNavigation('decks')
      let timeout = setInterval(()=>{
        let activeElement = naviboard.getActiveElement()
        if(activeElement){
          commit('setSoftkeys', activeElement.className)
          clearInterval(timeout)
        }
      }, 10)
    },
    openError({ commit, state }, value){
      clearInterval(state.errorTimeout)
      commit('changeError', value)
      commit('changeErrorVisibility', true)
      state.errorTimeout = setTimeout(()=>commit('changeErrorVisibility', false), 2500)
    },
    openFeedback({ commit, state }, value){
      clearInterval(state.feedbackTimeout)
      commit('changeFeedback', value)
      commit('changeFeedbackVisibility', true)
      state.feedbackTimeout = setTimeout(()=>commit('changeFeedbackVisibility', false), 2500)
    },
    loadDecks({dispatch}){
      db.decks.toArray()
        .then(res =>dispatch('updateDecks', res))
        .then(()=>dispatch('openFeedback', `Decks loaded`))
        .catch(()=>dispatch('openError', "Couldn't load decks, reach me at: janmichalak@int.pl"))
    },
    addDeck({commit, dispatch}, name){
      const obj = {name, flashcards: []}
      db.decks.add(obj)
        .then(()=>commit('addDeck', obj))
        .then(()=>dispatch('changeSection', 'decks'))
        .then(()=>dispatch('openFeedback', `Deck added`))
        .catch(()=>dispatch('openError', "There is already a deck with such name"))
    },
    editDeck({state, dispatch}, name){
      db.decks.update(state.currentDeck, {name})
        .then(()=>dispatch('loadDecks'))
        .then(()=>dispatch('openFeedback', `Deck edited`))
        .catch(()=>dispatch('openError', "There is already a deck with such name"))
    },
    removeDeck({state, dispatch}){
      db.decks.delete(state.currentDeck)
      .then(()=>dispatch('loadDecks'))
      .then(()=>dispatch('openFeedback', `Deck removed`))
      .catch(()=>dispatch('openError', "Couldn't remove the deck, reach me at: janmichalak@int.pl"))
    },
    loadFlashcards({commit, state, dispatch}){
      db.decks.get(state.currentDeck, res=>commit('setFlaschards', res.flashcards))
      .then(()=>dispatch('changeSection', 'flashcards'))
      .then(()=>dispatch('openFeedback', `Flashcards loaded`))
      .catch(()=>dispatch('openError', "Couldn't load flashcards, reach me at: janmichalak@int.pl"))
    },
    addFlashcard({state, commit,dispatch}, {front, back, freezed}){
      db.decks.where('name').equals(state.currentDeck)
        .modify((deck)=>{
          const flashcards = deck.flashcards
          if(flashcards.find(flashcard=>flashcard.front===front&&flashcard.back===back)===undefined){
            const obj = {front, back, level: 0, review: 0, freezed}
            flashcards.push(obj)
            commit('addFlashcard', obj)
          }else{
            throw 'dont duplicate'
          }
        })
        .then(()=>dispatch('changeSection', 'flashcards'))
        .then(()=>dispatch('openFeedback', `Flashcard added`))
        .catch(()=>dispatch('openError', "There is already a flashcard with such name"))
    },
    editFlashcard({state, commit, dispatch}, {front, back, freezed, reset}){
      db.decks.where('name').equals(state.currentDeck)
        .modify((deck)=>{
          const currentFront = state.currentFlashcard.front
          const currentBack = state.currentFlashcard.back
          const flashcards = deck.flashcards
          const index = flashcards.findIndex(flashcard=>flashcard.front===currentFront&&flashcard.back===currentBack)
          const occupiedIndex = flashcards.findIndex(flashcard=>flashcard.front===front&&flashcard.back===back)
          if(index === occupiedIndex || occupiedIndex < 0){
            const flashcard = flashcards[index]
            if(reset){
              flashcard.review = 0
              flashcard.level = 0
            }
            flashcard.freezed = freezed
            flashcard.front = front
            flashcard.back = back
            commit('setFlaschards', flashcards)
          }else{
            throw 'dont duplicate'
          }
        })
        .then(()=>dispatch('changeSection', 'flashcards'))
        .then(()=>dispatch('openFeedback', `Flashcard edited`))
        .catch(()=>dispatch('openError', "There is already a flashcard with such name"))
    },

    //todo add reseting all flashcards in the deck option

    removeFlashcard({state, commit, dispatch}){
      db.decks.where('name').equals(state.currentDeck)
        .modify((deck)=>{
          const flashcards = deck.flashcards
          const currentFront = state.currentFlashcard.front
          const currentBack = state.currentFlashcard.back
          const index = flashcards.findIndex(flashcard=>flashcard.front===currentFront&&flashcard.back===currentBack)
          flashcards.splice(index, 1)
          commit('setFlaschards', flashcards)
        })
        .then(()=>dispatch('changeSection', 'flashcards'))
        .then(()=>dispatch('openFeedback', `Flashcard removed`))
        .catch(()=>dispatch('openError', "Couldn't remove flashcard, reach me at: janmichalak@int.pl"))
    },

    resetDeckProgress({state, dispatch}){
      db.decks.where('name').equals(state.currentDeck)
        .modify((deck)=>{
          const flashcards = deck.flashcards
          flashcards.forEach(flashcard=>{flashcard.level = 0; flashcard.review = 0})
        })
        .then(()=>dispatch('changeSection', 'decks'))
        .then(()=>dispatch('openFeedback', `Deck's progress reseted`))
        .catch(()=>dispatch('openError', "Couldn't reset deck progress, reach me at: janmichalak@int.pl"))
    },

    removeDecksFlashcards({state, dispatch}){
      db.decks.update(state.currentDeck, {flashcards: []})
        .then(()=>dispatch('changeSection', 'decks'))
        .then(()=>dispatch('openFeedback', `Deck's flashcards removed`))
        .catch(()=>dispatch('openError', "Couldn't remove deck's flashcards, reach me at: janmichalak@int.pl"))
    },

    getTrainingFlashcards({state, commit, dispatch}){
      const today = Date.parse(new Date())
      db.decks.get(state.currentDeck, res=>res.flashcards.filter(flashcard=>flashcard.freezed===false&&flashcard.review <= today))
        .then(flashcards=>{
          if(flashcards.length===0){
            throw 'no cards to train'
          }else{
            commit('addTrainingFlashcards', flashcards)
            dispatch('changeSection', 'train')
          }
        })
        .then(()=>dispatch('openFeedback', `Flashcards loaded`))
        .catch(()=>dispatch('openError', "There is no flashcards to learn"))
    },
    processTrainingFlashcard({state, commit, dispatch}, answer){
      let done = false
      let nextDay = 0
      db.decks.where('name').equals(state.currentDeck)
        .modify(deck=>{
          const d = new Date();
          const firstFlashcard = state.trainingFlashcards[0]
          const flashcards = deck.flashcards
          const index = flashcards.findIndex(flashcard=>flashcard.front===firstFlashcard.front&&flashcard.back===firstFlashcard.back)
          const flashcard = flashcards[index]
          if(answer === 'wrong'){
            flashcard.review = 0
            flashcard.level = 0
            commit('insertTrainingFlashcard', flashcard)
          }else if(answer === 'good'){
            flashcard.level++
            const l = flashcard.level
            nextDay = Math.ceil(0.2*l*l*l)
            flashcard.review = d.setDate(d.getDate()+nextDay)
            if(state.trainingFlashcards.length === 1){
              done = true
            }
          }
        })
        .then(()=>done?dispatch('changeSection', 'flashcards'):commit('removeTrainingFlashcards'))
        .then(()=>commit('setSoftkeys'))
        .then(()=>dispatch('openFeedback', `Next repetition in ${nextDay} days`))
        .catch(()=>dispatch('openError', "Couldn't process answer, reach me at: janmichalak@int.pl"))
    },
  },
  modules: {
  }
})
