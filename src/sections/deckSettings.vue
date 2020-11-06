<template>
    <section class="section" id="deckSettings">
        <button class="deckSettings__button navigable" tabindex="1" @click="resetDeckProgress()">Reset Progress</button>
        <button class="deckSettings__button navigable" tabindex="1" @click="removeDecksFlashcards()">Remove all flashcards</button>
        <button class="deckSettings__button navigable" tabindex="1" @click="changeSection('decks')">Cancel</button>
    </section>
</template>

<script>
import { mapActions } from "vuex";
export default {
    methods: {
        ...mapActions(['resetDeckProgress', 'removeDecksFlashcards', 'changeSection']),
    }
}
</script>

<style>

</style>