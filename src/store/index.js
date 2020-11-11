import { createStore } from 'vuex'
import naviboard from 'naviboard';
import Dexie from 'dexie';

const db = new Dexie('flashcards');
db.version(1).stores({
  decks: 'name, flashcards'
});

const flashcards = {
  state: {
    currentFlashcard: {front: '', back: ''},
    flashcards: [{front: '', back: ''}],
    trainingFlashcards: [{front: '', back: ''}],
  },
  mutations: {
    setFlashards(state, arr){
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
  },
  actions: {
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
        .then(()=>dispatch('feedback/open', `Flashcards loaded`))
        .catch(()=>dispatch('error/open', "There is no flashcards to learn"))
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
        .then(()=>dispatch('feedback/open', `Next repetition in ${nextDay} days`))
        .catch(()=>dispatch('error/open', "Couldn't process answer, email me about the issue: janmichalak@int.pl"))
    },
    loadFlashcards({commit, state, dispatch}){
      db.decks.get(state.currentDeck, res=>commit('setFlashards', res.flashcards))
      .then(()=>dispatch('changeSection', 'flashcards'))
      .then(()=>dispatch('feedback/open', `Flashcards loaded`))
      .catch(()=>dispatch('error/open', "Couldn't load flashcards, email me about the issue: janmichalak@int.pl"))
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
        .then(()=>dispatch('feedback/open', `Flashcard added`))
        .catch(()=>dispatch('error/open', "There is already a flashcard with such name"))
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
            commit('setFlashards', flashcards)
          }else{
            throw 'dont duplicate'
          }
        })
        .then(()=>dispatch('changeSection', 'flashcards'))
        .then(()=>dispatch('feedback/open', `Flashcard edited`))
        .catch(()=>dispatch('error/open', "There is already a flashcard with such name"))
    },
    removeFlashcard({state, commit, dispatch}){
      db.decks.where('name').equals(state.currentDeck)
        .modify((deck)=>{
          const flashcards = deck.flashcards
          const currentFront = state.currentFlashcard.front
          const currentBack = state.currentFlashcard.back
          const index = flashcards.findIndex(flashcard=>flashcard.front===currentFront&&flashcard.back===currentBack)
          flashcards.splice(index, 1)
          commit('setFlashards', flashcards)
        })
        .then(()=>dispatch('changeSection', 'flashcards'))
        .then(()=>dispatch('feedback/open', `Flashcard removed`))
        .catch(()=>dispatch('error/open', "Couldn't remove flashcard, email me about the issue: janmichalak@int.pl"))
    },
    resetDeckProgress({state, dispatch}){
      db.decks.where('name').equals(state.currentDeck)
        .modify((deck)=>{
          const flashcards = deck.flashcards
          flashcards.forEach(flashcard=>{flashcard.level = 0; flashcard.review = 0})
        })
        .then(()=>dispatch('changeSection', 'decks'))
        .then(()=>dispatch('feedback/open', `Deck's progress reseted`))
        .catch(()=>dispatch('error/open', "Couldn't reset deck progress, email me about the issue: janmichalak@int.pl"))
    },

    removeDecksFlashcards({state, dispatch}){
      db.decks.update(state.currentDeck, {flashcards: []})
        .then(()=>dispatch('changeSection', 'decks'))
        .then(()=>dispatch('feedback/open', `Deck's flashcards removed`))
        .catch(()=>dispatch('error/open', "Couldn't remove deck's flashcards, email me about the issue: janmichalak@int.pl"))
    },
  }
}

const decks = {
  state: {
    currentDeck: '',
    decks: [],
  },
  mutations: {
    setDecks(state, arr){
      state.decks = arr
    },
    addDeck(state, object){
      state.decks.push(object)
    },
    changeCurrentDeck(state, name){
      state.currentDeck = name
    },
  },
  actions: {
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
    loadDecks({dispatch}){
      db.decks.toArray()
        .then(res =>dispatch('updateDecks', res))
        .then(()=>dispatch('feedback/open', `Decks loaded`))
        .catch(()=>dispatch('error/open', "Couldn't load decks, email me about the issue: janmichalak@int.pl"))
    },
    addDeck({commit, dispatch}, name){
      const obj = {name, flashcards: []}
      db.decks.add(obj)
        .then(()=>commit('addDeck', obj))
        .then(()=>dispatch('changeSection', 'decks'))
        .then(()=>dispatch('feedback/open', `Deck added`))
        .catch(()=>dispatch('error/open', "There is already a deck with such name"))
    },
    editDeck({state, dispatch}, name){
      db.decks.update(state.currentDeck, {name})
        .then(()=>dispatch('loadDecks'))
        .then(()=>dispatch('feedback/open', `Deck edited`))
        .catch(()=>dispatch('error/open', "There is already a deck with such name"))
    },
    removeDeck({state, dispatch}){
      db.decks.delete(state.currentDeck)
      .then(()=>dispatch('loadDecks'))
      .then(()=>dispatch('feedback/open', `Deck removed`))
      .catch(()=>dispatch('error/open', "Couldn't remove the deck, email me about the issue: janmichalak@int.pl"))
    },
  }
}

const softkeys = {
  state: {
    softkeys: {left: '', center: 'SELECT', right: ''}
  },
  mutations: {
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
  }
}

const sections = {
  state: {
    activeSection: 'decks'
  },
  mutations: {
    setActiveSection(state, value){
      state.activeSection = value
    },
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
  }
}

function alert(){
  return {
    namespaced: true,
    state: {
      timeout: undefined,
      message: '',
      show: false,
    },
    mutations: {
      changeMessage(state, value){
        state.message = value
      },
      changeVisibility(state, bool){
        state.show = bool
      },
    },
    actions: {
      open({ commit, state }, value){
        clearInterval(state.timeout)
        commit('changeMessage', value)
        commit('changeVisibility', true)
        state.timeout = setTimeout(()=>commit('changeVisibility', false), 2500)
      },
    }
  }
}

export default createStore({
  state: {
    ...flashcards.state,
    ...decks.state,
    ...softkeys.state,
    ...sections.state,
  },
  mutations: {
    ...flashcards.mutations,
    ...decks.mutations,
    ...softkeys.mutations,
    ...sections.mutations,
  },
  actions: {
    ...flashcards.actions,
    ...decks.actions,
    ...sections.actions,
  },
  modules: {
    //get "copy" of an object
    feedback: alert(),
    error: alert()
  }
})
