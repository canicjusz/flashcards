<template>
  <section class="section" id="editDeck">
      <input class="editDeck__input navigable" tabindex="1" type="text" v-model="name">
      <button class="editDeck__button editDeck__button-add navigable" tabindex="1" @click="editDeck(name), name=''">Edit Deck</button>
      <button class="editDeck__button editDeck__button-remove navigable" tabindex="1" @click="removeDeck(), name=''">Remove Deck</button>
      <button class="editDeck__button navigable" tabindex="1" @click="changeSection('decks'), name=''">Cancel</button>
  </section>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
    data(){
        return {
            name: ''
        }
    },
    watch:{
        currentDeck(val){
            this.name = val
        }
    },
    methods: {
        ...mapActions(['editDeck', 'removeDeck', 'changeSection']),
    },
    computed: mapState(['currentDeck'])
}
</script>

<style>

</style>