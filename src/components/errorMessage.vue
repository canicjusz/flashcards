<template>
  <div :class="['error', {'error--on': show}]">
    <p class="error__message">{{message}}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: mapState({show: state=>state.error.show, message: state=>state.error.message})
}
</script>

<style>
</style>