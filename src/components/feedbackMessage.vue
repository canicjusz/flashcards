<template>
  <div :class="['feedback', {'feedback--on': showFeedback}]">
    <p class="feedback__message">{{feedback}}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: mapState(['showFeedback', 'feedback'])
}
</script>

<style>
</style>