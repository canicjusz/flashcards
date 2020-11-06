<template>
    <section class="section" id="train">
        <div class="train__flashcard navigable" tabindex="1">
            <div class="train__flashcard-inner">
                <div class="train__flashcard-front">{{trainingFlashcards[0].front}}</div>
                <div class="train__flashcard-back">{{trainingFlashcards[0].back}}</div>
            </div>
        </div>
    </section>
</template>

<script>
import { mapState } from "vuex";
export default {
    computed: mapState(['trainingFlashcards']),
}
</script>

<style>

</style>