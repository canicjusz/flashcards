<template>
  <section class="section" id="addDeck">
      <input class="addDeck__input navigable" tabindex="1" type="text" v-model="name" placeholder="Deck name">
      <button class="addDeck__button navigable addDecks__item-add" tabindex="1" @click="addDeck(name), name = ''">Add Deck</button>
      <button class="addDeck__button navigable" tabindex="1" @click="changeSection('decks'), name = ''">Cancel</button>
  </section>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return {
            name: ''
        }
    },
    methods: {
        ...mapActions(['addDeck', 'changeSection']),
    }
}
</script>

<style>

</style>