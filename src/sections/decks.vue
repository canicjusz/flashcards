<template>
    <section class="section" id="decks">
        <ul class="decks__list">
            <li class="decks__item decks__item-adder navigable" tabIndex="1" >Add deck</li>
            <li class="decks__item navigable" tabIndex="1" v-for="(deck, i) in decks" :key="i">{{deck.name}}</li>
        </ul>
    </section>
</template>
<script>
import { mapState } from "vuex";
export default {
    computed: mapState(['decks'])
}
</script>

<style>

</style>