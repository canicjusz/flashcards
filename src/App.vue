<template>
<!-- show a section here -->
  <div class="top-bar">
    <p class="top-bar__text">{{barText}}</p>
  </div>
  <decks></decks>
  <addDeck></addDeck>
  <editDeck></editDeck>
  <flashcards></flashcards>
  <addFlashcard></addFlashcard>
  <editFlashcard></editFlashcard>
  <train></train>
  <deckSettings></deckSettings>
  <alert :type="'error'"></alert>
  <alert :type="'feedback'"></alert>
  <softkeys></softkeys>
</template>

<script>
import softkeys from "./components/softkeys.vue";
import alert from "./components/alert.vue";
import decks from "./sections/decks.vue";
import addDeck from "./sections/addDeck.vue";
import editDeck from "./sections/editDeck.vue";
import flashcards from "./sections/flashcards.vue";
import addFlashcard from "./sections/addFlashcard.vue";
import editFlashcard from "./sections/editFlashcard.vue";
import deckSettings from "./sections/deckSettings.vue";
import train from "./sections/train.vue";
import { mapActions, mapState } from "vuex";
import("./utils/navigation.js")
export default {
  name: 'App',
  components: {
    softkeys,
    decks,
    addDeck,
    flashcards,
    addFlashcard,
    editDeck,
    train,
    deckSettings,
    editFlashcard,
    alert
  },
  created(){
    this.loadDecks()
  },
  computed: {...mapState(['activeSection']),
    barText(){
      let text = this.activeSection[0].toUpperCase() + this.activeSection.substr(1)
      return text.match(/[A-Z][a-z]+/g).join(' ')
    }
  },
  methods: mapActions(['loadDecks'])
}
</script>

<style lang="sass">
@import "./styles/style.sass"
</style>
