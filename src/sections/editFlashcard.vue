<template>
    <section class="section" id="editFlashcard">
        <input class="editFlashcard__input navigable" tabindex="1" type="text" v-model="front">
        <input class="editFlashcard__input navigable" tabindex="1" type="text" v-model="back">
        <p class="editFlashcard__label navigable"><input type="checkbox" class="editFlashcard__checkbox" v-model="freezed">Freeze</p>
        <p class="editFlashcard__label navigable"><input type="checkbox" class="editFlashcard__checkbox" v-model="reset">Reset progress</p>
        <button class="editFlashcard__button editFlashcard__button-edit navigable" tabindex="1" @click="editFlashcard({front, back, freezed, reset}), clearInputs()">Edit Flashcard</button>
        <button class="editFlashcard__button editFlashcard__button-remove navigable" tabindex="1" @click="removeFlashcard(), clearInputs()">Remove Flashcard</button>
        <button class="editFlashcard__button navigable" tabindex="1" @click="changeSection('flashcards'), clearInputs()">Cancel</button>
    </section>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
    data(){
        return {
            front: '',
            back: '',
            reset: false,
            freezed: false
        }
    },
    watch:{
        currentFlashcard(val){
            this.front = val.front
            this.back = val.back
        }
    },
    methods: {
        ...mapActions(['editFlashcard', 'removeFlashcard', 'changeSection']),
        clearInputs(){
            this.front = '',
            this.back = '',
            this.freezed = false
        }
    },
    computed: mapState(['currentFlashcard'])
}
</script>

<style>

</style>