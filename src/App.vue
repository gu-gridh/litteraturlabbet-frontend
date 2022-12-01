<template>
  <div class="main-container">
    <div class="left-column">
      <div class="lb-logo-container">
        
      </div>
      <div class="ll-logo-container">
       Litteratur<br>Laboratoriet
      </div>

      <nav class="nav-links">
        <router-link to="/" class="nav-link">Utforska</router-link>
        <router-link to="/about" class="nav-link">Om</router-link>
      </nav>

      <div class="search-container">
        <div class="multiselect-input" id="author-select">
          <div class="select-label"><p>Välj en författare...</p></div>
          <Multiselect
            v-model="author"
            :value="author"
            mode="single"
            placeholder="Sök författare"
            noResultsText="Inga författare matchar sökningen"
            noOptionsText="Inga författare matchar sökningen"
            :resolve-on-load="true"
            :delay="1"
            :searchable="true"
            :object="true"
            valueProp="id"
            label="formatted_name"
            :options="async (query: string, select$: any) => searchAuthor(query)"
            :clear-on-select="true"
            :clear-on-search="true"
            @select="onSelectAuthor"
            @clear="onClearAuthor"
            ref="authorSelect"
          />
        </div>
        <div class="multiselect-input" id="work-select">
          <div class="select-label"><p>... eller sök på ett verk!</p></div>
          <Multiselect
            v-model="work"
            :value="work"
            mode="single"
            placeholder="Sök verk"
            noResultsText="Inga verk matchar sökningen"
            noOptionsText="Inga verk matchar sökningen"
            :resolve-on-load="true"
            :delay="1"
            :searchable="true"
            :object="true"
            valueProp="id"
            label="title"
            :clear-on-select="true"
            :clear-on-search="true"
            :options="async (query: string, select$: any) => searchWork(query, {main_author: author?.id})"
            @select="onSelectWork"
            @clear="onClearWork"
            ref="workSelect"
          />
        </div>
        <div class="count-label">
          <p>Totalt {{ workCount }} verk i samlingen.</p>
        </div>
      </div>
    </div>
    <div class="right-column">
      <div class="right-view-container">
         <nav class="nav-links">
        <router-link to="/" class="nav-link">Textåterbruk</router-link>
        <router-link to="/about" class="nav-link">Ordvektorer</router-link>
      </nav>
          <div class="right-view-container-content">
        <reuse-view />
      </div>
        </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import LbLogo from "./components/icons/LbLogo.vue";
import Multiselect from "@vueform/multiselect";
import ReuseView from "@/views/ReuseView.vue";
import { list, get, count } from "@/services/diana";
import type { Author, Work, Count } from "@/types/litteraturlabbet";
import { searchStore } from "@/stores/search";


const store = searchStore();

// Search functions
function searchAuthor(query: string): Promise<Array<Author>> {
  return list<Author>("author", { search: query, limit: 500 }).then((a) => {
    return a.results;
  });
}

function searchWork(query: string, params: object): Promise<Array<Work>> {
  return list<Work>("work", { search: query, limit: 500, ...params }).then(
    (a) => {
      return a.results;
    }
  );
}

// Callbacks
// After selecting
async function onSelectAuthor(value: Author, select$: any) {
  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();

  // Update the work count
  countWorks();

  // Set global store value
  store.author = value;
}

async function onSelectWork(value: Work, select$: any) {
  const work = await get<Work>(value.id, "work");
  const workAuthor = await get<Author>(work.main_author as number, "author");

  author.value = workAuthor;

  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();

  // Set global store value
  store.work = value;
  store.author = workAuthor;
}

function countWorks() {
  list<Work>("work", {
    main_author: author.value?.id,
  }).then((w) => {
    workCount.value = w.count;
  });
}

// After clearing
function onClearAuthor(event: undefined) {
  store.author = undefined;
  store.work = undefined;
  work.value = undefined;
}

function onClearWork(event: undefined) {
  store.work = undefined;
  workSelect.value.refreshOptions();
}

const author = ref<Author | undefined>(undefined);
const work = ref<Work | undefined>(undefined);
const authorSelect = ref();
const workSelect = ref();
const workCount = ref<number>();

onMounted(() => {
  countWorks();
});
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>
html,
body {
  height: 100% !important;
  width: 100% !important;
  margin: 0 !important;

  font-family: "Barlow Condensed", sans-serif !important;

  background: linear-gradient(
    to bottom,
    rgba(245, 245, 245, 1) 0,
    rgba(220, 220, 220, 0.9) 750px,
    rgba(210, 210, 210, 0.8) 1000px
  )!important;
  background-image:url("@/assets/lbbg1.jpg")!important;
  Background-repeat:no-repeat!important;
  background-size:cover!important;
}

#app {
  height: inherit;
  width: inherit;
  padding: 0 0 0 0 !important;
  margin: 0 0 0 0 !important;
  /* display: flex !important; */
}

a:link {
  color: white;
  text-decoration:none;
 
}


a:visited {
  text-decoration:none;
  color: white;
  text-decoration-style: none;
  
}

a:hover{

}



.ll-logo-container {
   font-family: 'Cormorant Garamond', serif;
   letter-spacing: -6px;
   color:white;
width:100%;
font-size:100px;
line-height:0.75;
  margin-top: 20px;
  margin-bottom: 35px;
  margin-left: 0px;
  Height:145px;
}

.lb-logo-container {
  /* width: 360px !important; */
  /* height: 280px !important; */
  margin-top: 50px;
margin-left:-10px;
  width:80px;
  height:80px;
    background-image:url("@/assets/lblogo.png")!important;
    background-size:80px;
}

.nav-links {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  column-gap: 1rem;
  width: 75%;
}

.nav-link {
  font-size: 25px;
 font-weight:300;
  padding: 0.4rem 0.8rem 0.4rem 0.8rem;
  margin-right: 0.25rem;
  border-radius: 10px;
  background-color: rgb(255, 255, 255, 0.0);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.nav-link:hover {
  opacity: 1;
  background-color: rgb(255, 255, 255);
  color: black;
}

.multiselect-input {
  margin-bottom: 0.5rem;
  margin-left: 2rem;
  margin-right: 2rem;
}

.select-label {
  font-size: large;
  color: black;
  font-style: normal;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.count-label {
  font-size: large;
  color: black;
  font-style: normal;
  text-align:center;
  margin-bottom: 2rem;
 border-style:dotted;
 border-color:grey;
 border-width:1px 0 0 0;
  margin-top: 2rem;
  padding: 2rem 0 0 0;
}

.main-container {
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
}

.left-column {
  width: 30%;
  min-width:400px;
  padding-left:80px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* justify-content: flex-start; */
  align-items: left;
}

.right-column {
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100vh;

}

.right-view-container {
  width: 80%;
  margin: auto;
  margin-top: 330px;

}

.right-view-container-content {
  background-color:white;
  border-radius:12px;
    background-color:white;
  border-radius:10px;
  min-height:330px;

   overflow:hidden;
}

.search-container {
  
  margin-left:0px;
  width: 100%;
  /* height: 3px; */
  background-color: rgb(255, 255, 255, 1.0);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: space-between;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>
