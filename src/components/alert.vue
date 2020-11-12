<template>
  <div :class="[type, 'alert', {'alert--show': show}]">
    <p class="alert__message">{{message}}</p>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: ["type"],
    computed: {
        ...mapState({
            show(state){
                return state[this.type].show
            },
            message(state){
                return state[this.type].message
            }
        })
    }
}
</script>

<style>
</style>