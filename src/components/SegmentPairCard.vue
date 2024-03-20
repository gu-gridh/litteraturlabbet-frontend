<template>
  
    <div class="segment-pair-card">
      
        <div class="column column-left">
          <div class="segment-metadata-container">
            <p class="segment-card-title author-title">{{ props.segment1.series.main_author.formatted_name }}</p>
            <p class="segment-card-title" style="font-style:italic;" :title="props.segment1.series.title">{{ props.segment1.series.short_title ? props.segment1.series.short_title : props.segment1.series.title }} <p style="font-style:normal; display:inline; color:var(--theme-accent-color);; margin-left:10px;">{{ props.segment1.series.imprint_year }}</p></p>
          </div>
          <div class="segment-text-container">
            <a v-bind:href="lblink1" target="_blank">
              <div class="page-text" v-html="text1"></div>
            </a>
          </div>
      </div>
  
      <div class="column column-right">
        <div class="segment-metadata-container">
          <p class="segment-card-title author-title">{{ props.segment2.series.main_author.formatted_name }}</p>
          <p class="segment-card-title" style="font-style:italic;" :title="props.segment2.series.title">{{ props.segment2.series.short_title ? props.segment2.series.short_title : props.segment2.series.title }} <p style="font-style:normal; display:inline; color:var(--theme-accent-color); margin-left:10px;">{{ props.segment2.series.imprint_year }}</p></p>
        </div>
        <div class="segment-text-container">
          <a v-bind:href="lblink2" target="_blank">
            <div class="page-text" v-html="text2"></div>
          </a>
        </div>
      </div>
    </div>
  
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { setNotBusy } from "./Waiter.vue";
import { etext_ids } from "@/assets/etext_ids.json";

const props = defineProps<{
  segment1: any;
  segment2: any;
  lblink?: string;
}>();

let text1 = props.segment1.page.text;
let text2 = props.segment2.page.text;
let lblink1 = "";
let lblink2 = "";
const isEtext1 = etext_ids.indexOf(props.segment1.series.id) > -1;
const isEtext2 = etext_ids.indexOf(props.segment2.series.id) > -1;
if (props.segment1) {
   text1 = text1.replace(
    props.segment1.text,
    `<span class="highlight">${props.segment1.text}</span>`
  );
  lblink1 = "https://litteraturbanken.se/f%C3%B6rfattare/"+props.segment1.series.main_author.lbauthorid+"/titlar/"+props.segment1.series.modernized_title+"/sida/"+(props.segment1.page.number+(isEtext1?0:1))+(isEtext1?"/etext":"/faksimil");
 
}
if (props.segment2) {
  text2 = text2.replace(
    props.segment2.text,
    `<span class="highlight">${props.segment2.text}</span>`
  );
  lblink2 = "https://litteraturbanken.se/f%C3%B6rfattare/"+props.segment2.series.main_author.lbauthorid+"/titlar/"+props.segment2.series.modernized_title+"/sida/"+(props.segment2.page.number+(isEtext2?0:1))+(isEtext2?"/etext":"/faksimil");
}

onMounted(() => {
  setNotBusy();
});
</script>

<style scoped>
.segment-pair-card {
  /* padding: 2rem 1rem 2rem 1rem; */
  margin: 1rem 1.5rem 1rem 0rem;
  background-color:rgb(245,245,245);
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  transition: all .2s ease-in-out;
  border-color:transparent;
  border-width:0.5px;
  border-style:solid;
 
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
  min-height:80px;
  background-color: rgb(245,245,245);
  color: black;
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 8px 8px 0 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-style:dotted;
  border-color:var(--theme-accent-color-light);
  border-width:0 0 1px 0px;
  line-height: 1.5em;
 
}

.column-left {
  width:50%;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start;
  
}

.column-right {
  width:50%;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start;
  
}

.segment-size-label {
  font-size: xx-large;
}

.segment-card-title {
  font-weight:400;
  font-size: 1.5em;
  padding-top:12px;
}

.author-title {
  font-weight: 600;
  color:var(--theme-accent-color);
  height:auto;
 
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
