<template>
  <div class="card-container">
    <div class="back-button" @click="customBack()">Tillbaka</div>
    <div class="page-container">
      <div class="title-container">
        <div class="title">
          {{ work.title }}
        </div>
        <div class="author">{{ author.name }}, {{ work.sort_year }}</div>
      </div>
      <div class="page-text" v-html="text"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { setBusy } from "@/components/Waiter.vue";
import { get } from "@/services/diana";
import type {
  Author,
  Page,
  Work,
  Segment,
} from "@/types/litteraturlabbet";
import { onBeforeUnmount } from "vue";

const props = defineProps<{
  id: number;
  segment: number;
}>();

const page = await get<Page>(props.id, "page");
const work = await get<Work>(page.work.id as number, "work");
const author = await get<Author>(work.main_author.id as number, "author");
let text = page.text;
console.log(props.segment);
if (props.segment) {
  const segment = await get<Segment>(props.segment, "segment");

  text = text.replace(
    segment.text,
    `<span class="highlight">${segment.text}</span>`
  );

  console.log(text);
}

function customBack() {
    setBusy();
    history.back()
  }

  onBeforeUnmount(() => {
    setBusy();
  });
</script>

<style>
.highlight {
  font-weight: 800;
}
</style>

<style scoped>
.card-container {
  height: 80%;
}



.page-container {
  margin-left: 3rem;
  margin-right: 3rem;
  margin-bottom: 3rem;
  line-height: 2rem;
}

.page-text {
  font-size: 20px;
  line-height: 1.2;

}

.title-container {
  margin-bottom: 2rem;
}

.title {
  font-family: "Cormorant Garamond", serif;
  letter-spacing: -3px;
  margin-top: 30px;
   margin-bottom: 10px;
  font-size: 40px;
  line-height: 1.0;
  color: black;
}

.author {
  font-size: 20px;
  font-weight:500;
}

.back-button:hover {
  background-color: rgb(80,80,80);
  color: white;
}

@media screen and (max-width: 950px) {
  .back-button {
    margin-top: 40px;
    margin-left: 50px;
    font-size: 28px;
    width: 120px;
  }
}
</style>
