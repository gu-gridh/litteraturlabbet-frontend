<template>
  
    <div class="segment-card">
      <div class="segment-metadata-container">
        <p class="segment-card-title">{{ author.formatted_name }}</p>
        <p class="segment-card-title" style="font-style:italic;" :title="work.title">{{ work.short_title ? work.short_title : work.title }} <p style="font-style:normal; display:inline; color:rgb(220,30,30); margin-left:10px;">{{ work.sort_year }}</p></p>
        
      </div>
      <!-- <router-link
    :to="{
            name: 'page',
            params: {
              id: segment.page as number,
            },
            query: {
              segment: segment.id,
            }
          }"
  > -->
      <div class="segment-text-container">
        <div class="page-text" v-html="text"></div>
      </div>
      
    <!-- </router-link> -->
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
const work = await get<Work>(page.work as number, "work/19th_century");
const author = await get<Author>(work.main_author as number, "author");

let text = page.text;
if (props.segment) {
  const segment = await get<Segment>(props.segment.id, "segment");

  text = text.replace(
    segment.text,
    `<span class="highlight">${segment.text}</span>`
  );

  //console.log(text);
}
</script>

<style scoped>
.segment-card {
  /* padding: 2rem 1rem 2rem 1rem; */
  margin: 1rem 2.7rem 1rem 2.7rem;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
  margin-bottom: 30px;
  transition: all .2s ease-in-out;
 
}

.segment-card:hover {
 transform: scale(1.01);
    cursor:pointer;
}

.segment-text-container {
  width: 100%;
  color: black;
  /* background-color: white; */
  /* opacity: 0.9; */
  padding: 2rem 2rem 2rem 2rem;
  font-style: normal;
  line-height: 1.2;
  font-size: 18px;
 

 
}

.segment-metadata-container {
  width: 100%;
  background-color: rgb(255,255,255);
  color: black;
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 8px 8px 0 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
 
}

.segment-size-label {
  font-size: xx-large;
}

.segment-card-title {
  font-weight:400;
  font-size: 1.5em;
}

.author-name {
  font-weight: 600;
}

@media screen and (max-width: 950px) {
  .segment-text-container {
    font-size: 24px;
  }

  .work-title {
    font-size: 30px;
  }

  .segment-size-label {
    font-size: 30px;
  }
  .author-name {
    font-size: 30px;
  }
}
</style>
