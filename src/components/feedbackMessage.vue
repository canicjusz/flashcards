<template>
  <div :class="['feedback', {'feedback--on': show}]">
    <p class="feedback__message">{{message}}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: mapState({show: state=>state.feedback.show, message: state=>state.feedback.message})
}
</script>

<style>
</style>