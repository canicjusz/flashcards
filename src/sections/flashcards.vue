<template>
    <section class="section" id="flashcards">
        <ul class="flashcards__list">
            <li class="flashcards__item flashcards__item-adder navigable" tabIndex="1" >Add Flashcard</li>
            <li class="flashcards__item flashcards__flashcard navigable" tabIndex="1" v-for="(flashcard, i) in flashcards" :key="i">
                <div class="flashcards__flashcard-inner">
                    <div class="flashcards__flashcard-front">{{flashcard.front}}</div>
                    <div class="flashcards__flashcard-back">{{flashcard.back}}</div>
                </div>
            </li>
        </ul>
    </section>
</template>

<script>
import { mapState } from "vuex";
export default {
    computed: mapState(['flashcards'])
}
</script>

<style>

</style>