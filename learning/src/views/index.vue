<template>
  <div class="index">
    <div v-for="(item, index) in routes" :key="index">
      <a :href="item.path">{{ item.meta?.title }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const Router = useRouter();

const { routes } = Router.options;
</script>

<style>
.index {
  padding: 20px;
  line-height: 2;
}
</style>
