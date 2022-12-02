<template>
  <div class="main-container">
    <div class="left-column">
      <div class="lb-logo-container"></div>

      <div class="ll-logo-container">Litteratur<br />Laboratoriet</div>

      <nav class="nav-links">
        <router-link to="/" class="nav-link">Välkommen</router-link>
        <router-link to="/about" class="nav-link">Om verktyget</router-link>
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

        <div class="button-container">
          <router-link
            :to="{
              name: 'reuse',
              query: {
                author: author?.id,
                work: work?.id,
              },
            }"
            v-slot="{ href }"
          >
            <button :href="href" class="search-button">Sök</button>
          </router-link>
        </div>
      </div>
    </div>
    <div class="right-column">
      <div class="right-view-container">
        <nav class="nav-links">
          <router-link to="/reuse/" class="nav-link">Textåterbruk</router-link>
          <router-link to="/embedding" class="nav-link"
            >Ordvektorer</router-link
          >
        </nav>
        <div class="right-view-container-content">
          <Suspense>
            <router-view />
          </Suspense>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import Multiselect from "@vueform/multiselect";
import { list, get } from "@/services/diana";
import type { Author, Work } from "@/types/litteraturlabbet";
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
    to right,
    rgb(80, 57, 108),
    rgb(168, 107, 75),
    rgb(255, 144, 39)
  ) !important;
}

/* .bgmask {
        width: 100%;
        height:2000px;
        background:url("@/assets/lbbgmask.png");
        background-color:green;
        background-repeat: no-repeat;
        background-position:bottom;
     background-size:cover%;
        opacity: 1.0;
       position:absolute;
       margin-top:calc(105% - 2000px); 

} */

a:link {
  color: white;
  text-decoration: none;
}

a:visited {
  text-decoration: none;
  color: white;
  text-decoration-style: none;
}

a:hover {
}

#app {
  height: inherit;
  width: inherit;
  padding: 0 0 0 0 !important;
  margin: 0 0 0 0 !important;
  /* display: flex !important; */
}

.ll-logo-container {
  font-family: "Cormorant Garamond", serif;
  letter-spacing: -6px;
  color: white;
  width: 100%;
  font-size: 100px;
  line-height: 0.75;
  margin-top: 20px;
  margin-bottom: 35px;
  margin-left: 0px;
  height: 145px;
  z-index: 1;
}

.lb-logo-container {
  /* width: 360px !important; */
  /* height: 280px !important; */
  margin-top: 50px;
  margin-left: -10px;
  width: 80px;
  height: 80px;
  background-image: url("@/assets/lblogo.png") !important;
  background-size: 80px;
  z-index: 1;
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
  z-index: 1;
}

.nav-link {
  font-size: 25px;
  font-weight: 300;
  padding: 0.2rem 0.8rem 0.2rem 0.8rem;
  margin-right: 0.25rem;
  border-radius: 10px;
  background-color: rgb(255, 255, 255, 0);
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
  text-align: center;
  margin-bottom: 1rem;
  border-style: dotted;
  border-color: grey;
  border-width: 1px 0 0 0;
  margin-top: 2rem;
  padding: 2rem 0 0 0;
}

.super-main-container {

display: flex;
  flex-direction: column;


}

.main-container {
  display: flex;  
  flex-direction: row;
}

.left-column {
  width: 30%;
  min-width: 500px;
  padding-left: 80px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: left;

}

.right-column {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 70%;
  height: 100vh;
}

.right-view-container {
  width: 85%;
  margin: auto;
  margin-top: 330px;
}

.right-view-container-content {

  background-color: white;
  border-radius: 12px;
  background-color: white;
  border-radius: 10px;
  min-height: 400px;
  overflow: hidden;
  margin-bottom: 50px;
  z-index: 1;
}

.search-container {
  margin-left: 0px;
  width: 100%;
  height: 400px;
  background-color: rgb(255, 255, 255, 1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: space-between;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
    z-index:1;
}

.button-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.search-button {
  font-family: "Barlow Condensed", sans-serif !important;
  padding: 0.4rem 1.0rem 0.4rem 1.0rem;
  font-size: 25px;
  color: white;
  background-color: rgb(182, 82, 139);
  border-color: none !important;
  border-radius: 10px;
  border: 0px solid transparent !important;
  margin-bottom: 1.5rem;
  position:absolute;
  margin-left:-30px;
}

button{
  color:white;
  overflow:hidden;

}


.search-button:hover {
  background-color: rgb(233, 102, 176) !important;
  color: black !important;
}

.multiselect {
  color: rgb(60, 40, 40);
  --ms-bg: rgb(240, 240, 240);
  --ms-ring-width: 0px;
  --ms-border-width: 0px;
  --ms-font-size: 1.5rem;
  --ms-radius: 8px;
  --ms-option-color-pointed: black;
  --ms-option-bg-selected: rgb(182, 82, 139);
  --ms-option-font-size: 1.2rem;
  --ms-option-line-height: 1.375;
  --ms-option-bg-pointed: rgb(230, 230, 230);
  --ms-option-color-pointed: Black;

  --ms-option-color-selected: #fff;
  --ms-option-bg-disabled: black;
  --ms-option-color-disabled: #d1d5db;
  --ms-option-bg-selected-pointed: rgb(182, 82, 139);
  --ms-option-color-selected-pointed: #ffffff;
  --ms-option-bg-selected-disabled: black;
  --ms-option-color-selected-disabled: #d1fae5;
}

#foot{
display: flex;
  flex-direction: column;
  align-items: center;
}


</style>
