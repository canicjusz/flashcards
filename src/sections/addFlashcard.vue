<template>
    <section class="section" id="addFlashcard">
        <input class="addFlashcard__input navigable" tabindex="1" type="text" v-model="front" placeholder="Flashcard's front">
        <input class="addFlashcard__input navigable" tabindex="1" type="text" v-model="back" placeholder="Flashcard's back">
        <p class="addFlashcard__label navigable"><input type="checkbox" class="addFlashcard__checkbox" v-model="freezed">Freeze</p>
        <button class="addFlashcard__button addFlashcard__button-add navigable" tabindex="1" @click="addFlashcard({front, back, freezed}), clearInputs()">Add Flashcard</button>
        <button class="addFlashcard__button navigable" tabindex="1" @click="changeSection('flashcards'), clearInputs()">Cancel</button>
    </section>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data(){
        return {
            front: '',
            back: '',
            freezed: false
        }
    },
    methods: {
        ...mapActions(['addFlashcard', 'changeSection']),
        clearInputs(){
            this.front = '',
            this.back = '',
            this.freezed = false
        }
    }
}
</script>

<style>

</style>