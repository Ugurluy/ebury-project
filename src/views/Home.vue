<template>
  <div class="home">
    <CurrencyConverter />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CurrencyConverter from "../components/CurrencyConverter.vue";

@Component({
  components: {
    CurrencyConverter,
  },
})
export default class extends Vue {}
</script>