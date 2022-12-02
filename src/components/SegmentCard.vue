<template>
  <div class="segment-card">
    <div class="segment-metadata-container">
      <p class="work-title">{{ work.short_title }}</p><p class="author-name">{{ author.name }}</p>
    </div>
    <div class="segment-text-container">
      {{ segment.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { list, get } from "@/services/diana";
import type { Author, Page, Work, Segment } from "@/types/litteraturlabbet";

const props = defineProps<{
  segment: Segment;
}>();

const page = await get<Page>(props.segment.page as number, "page");
const work = await get<Work>(page.work as number, "work");
const author = await get<Author>(work.main_author as number, "author");

</script>

<style scoped>
.segment-card {
  /* padding: 2rem 1rem 2rem 1rem; */
  margin: 1rem 1rem 1rem 1rem;
  background-color: antiquewhite;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.segment-text-container {
  width: 100%;
  color: black;
  /* background-color: white; */
  /* opacity: 0.9; */
  padding: 2rem 2rem 2rem 2rem;
  font-style: italic;
}

.segment-metadata-container {
  width: 100%;
    background-color: rgb(142, 42, 99);
  color: white;
  padding: 1rem 1rem 1rem 1rem;
  border-radius: 8px 8px 0 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.segment-size-label {
  font-size: xx-large;
}

.work-title {
    font-style: italic;
    font-size: large;
}

.author-name {
    font-weight: 600;
}
</style>
