<template>
  <div style="width:100%; height:0px;">
    <!-- <div class="connection"></div> -->
  </div>
  <div class="search-container">

    <div class="welcome" v-show="showWelcome">
      <Welcome></Welcome>
    </div>
    <div class="search-UI" v-show="showSearch">

      <div class="slider-container">
        <div class="select-label" style="margin-top:65px; text-align:center;">
          <!-- <p>Välj ett tidsomfång</p> -->
        </div>
        <div class="slider-input">
          <Slider v-model="timeRange" :min="1700" :max="2025" :step="5" class="sliderColor" />
        </div>
      </div>

      <div class="multiselect-input" id="author-select">
        <div class="select-label">
          <p>Sök efter författare</p>
        </div>
        <Multiselect v-model="store.author" :value="store.author" mode="single" spellcheck="false"
          placeholder="Författare #1" noResultsText="Inga författare matchar sökningen"
          noOptionsText="Inga författare matchar sökningen" :resolve-on-load="true" :delay="1" :searchable="true"
          :object="true" valueProp="id" label="formatted_name"
          :options="async (query: string, select$: any) => searchAuthor(query)" :clear-on-select="true"
          :clear-on-search="true" @select="onSelectAuthor1" @clear="onClearAuthor1" ref="authorSelect" />

        <div id="author2-select" v-show="showReuseSearch">
          <Multiselect :type="search" v-model="store.author2" :value="store.author2" mode="single" spellcheck="false"
            placeholder="Författare #2" noResultsText="Inga författare matchar sökningen"
            noOptionsText="Inga författare matchar sökningen" :resolve-on-load="true" :delay="1" :searchable="true"
            :object="true" valueProp="id" label="formatted_name"
            :options="async (query: string, select$: any) => searchAuthor(query)" :clear-on-select="true"
            :clear-on-search="true" :disabled="store.work || !store.author" @select="onSelectAuthor2"
            @clear="onClearAuthor2" ref="authorSelect2" style="margin-top:10px;" />
        </div>

      </div>
      <div class="multiselect-input" id="work-select">
        <div class="select-label">
          <p>Sök efter verk</p>
        </div>
        <Multiselect v-model="store.work" :value="store.work" mode="single" spellcheck="false" placeholder="Verk"
          noResultsText="Inga verk matchar sökningen" noOptionsText="Inga verk matchar sökningen" :resolve-on-load="true"
          :delay="1" :searchable="true" :object="true" valueProp="id" label="title" :clear-on-select="true"
          :clear-on-search="true" :disabled="store.author2"
          :options="async (query: string, select$: any) => searchWork(query, { main_author: store.author?.id })"
          @select="onSelectWork" @clear="onClearWork" ref="workSelect" />
      </div>

      <div class="multiselect-input" id="phrase-select" v-show="showReuseSearch">
        <div class="select-label">
          <p>Sök efter en fras</p>
        </div>
        <input type="search" id="search" class="search-box" name="search" spellcheck="false" placeholder="Fras"
          :value="searchQuery" @keydown="handleBackspace" @input="updateSearchQuery($event.target?.value)"
          @keydown.enter="triggerSearch" @clear="onClearPhrase" />
        <div v-if="errorMessage">
          <span class="errormessage">{{ phraseErrorMessage }}</span>
        </div>

      </div>
    <!--   <div class="slider-container" v-show="showSlider">
        <div class="select-label" style="margin-bottom:50px; text-align:center;">
          <p>Välj ett tidsomfång</p>
        </div>
        <div class="slider-input">
          <Slider v-model="timeRange" :min="1800" :max="1900" :step="5" class="sliderColor" />
        </div>
      </div> -->

      <div class="count-label">
        <p>Totalt {{ workCount }} verk i samlingen.</p>
      </div>

      <div class="button-container">
        <div v-if="!hasQuery">
          <div v-if="store.author2">
            <div class="search-button2" @click="triggerSearch1">Sök</div>
            <!--
            <router-link :to="{
              name: 'reuse-link',
              params: {
                id1: store.author?.id,
                id2: store.author2?.id,
              },
            }" v-slot="{ href }" class="search-button">Sök
            </router-link>
            -->
          </div>
          <div v-if="!store.author2">
            <div class="search-button2" @click="triggerSearch2">Sök</div>
            <!--
            <router-link :to="{
              name: 'reuse',
              query: {
                author: store.author?.id,
                work: store.work?.id,
              },
            }" v-slot="{ href }" class="search-button">Sök
            </router-link>
            -->
          </div>
        </div>
        <div v-if="hasQuery">
          <div class="search-button2" @click="triggerSearch">Sök
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Multiselect from "@vueform/multiselect";
import Slider from '@vueform/slider'
import { list, get } from "@/services/diana";
import type { Author, Work } from "@/types/litteraturlabbet";
import { searchStore } from "@/stores/search";
import reuseAuthors from "@/assets/authors_with_reuse_copy.json";
import { useRoute } from 'vue-router'
import Welcome from "@/components/Welcome.vue";
import { works } from "@/assets/works.json";
import { authors } from "@/assets/authors.json";
import router from "@/router";
import {inject} from 'vue';
import {setBusy, setNotBusy} from "@/components/Waiter.vue";

const store = searchStore();

const authorSelect = ref();
const workSelect = ref();
const workCount = ref<number>();

const collator = new Intl.Collator('sv-u-co-trad');

const timeRange = [1700, 2025];

const showSlider = ref(false);
const showReuseSearch = ref(false);
const showSearch = ref(false);
const showWelcome = ref(true);

const route = useRoute()

const searchQuery = ref("");
const errorMessage = ref(false);
const hasQuery = ref(false);
let phraseErrorMessage = ref("");

const currentAuthor = ref(-1);
const currentAuthor2 = ref(-1);
const currentWork = ref(-1);

let author2changed = false;

function handleBackspace(event: KeyboardEvent) {
  if (event.key === "Backspace") {
    if (searchQuery.value.length === 0) {
      store.phrase = undefined;
      hasQuery.value = false;
      event.preventDefault();
    }
  }
}

function updateSearchQuery(value: string) {
  errorMessage.value = false;
  store.author = undefined;
  store.author2 = undefined;
  store.work = undefined;
  searchQuery.value = value;
  if (value === "") {
    hasQuery.value = false;
  } else {
    hasQuery.value = true;
  }
}

// Search functions            
async function triggerSearch1() {
  setBusy();
  if (store.author?.id === currentAuthor.value && store.author2?.id === currentAuthor2.value) {
    setNotBusy();
    errorMessage.value = true;
    phraseErrorMessage.value = "Du har redan sökt efter denna kombination.";
    return;
  }
  errorMessage.value = false;
  console.log(store.author?.id, store.author2?.id);
  router.push({ name: 'reuse-link', params: { id1: store.author?.id, id2: store.author2?.id } });//.then(() => { router.go(0) });
  currentAuthor.value = store.author!.id;
  currentAuthor2.value = store.author2!.id;
}

async function triggerSearch2() {
  setBusy();
  if (!store.author) {
    setNotBusy();
    errorMessage.value = true;
    // error message that you need to select an author, two authors, a work, or a phrase
    phraseErrorMessage.value = "Du måste välja en eller två författare, en författare och en verk eller en fras.";
    return;
  }
  if (store.author?.id === currentAuthor.value) {
    //console.log(store.work?.id, currentWork.value);
    if (store.work) {
      if (store.work?.id == currentWork.value) {
        setNotBusy();
        errorMessage.value = true;
        phraseErrorMessage.value = "Du har redan sökt efter denna kombination.";
        return;
      }
    } else {
      if (currentWork.value < 0) { 
        if (!author2changed) {
        setNotBusy();
        errorMessage.value = true;
        phraseErrorMessage.value = "Du har redan sökt efter den här författaren.";
        return;
      }
      }
    }
  }
  errorMessage.value = false;
  console.log(store.author?.id, store.work?.id);
  router.push({ name: 'reuse2', params: { author: store.author?.id, work: store.work?.id } });//.then(() => { router.go(0) });
  currentAuthor.value = store.author!.id;
  currentWork.value = store.work ? store.work.id : -1;
}

async function triggerSearch() {
  setBusy();
  if (searchQuery.value === store.phrase) {
    setNotBusy();
    errorMessage.value = true;
    phraseErrorMessage.value = "Du har redan sökt efter denna fras.";
    return;
  }
  const searchQueryWords = searchQuery.value.split(" ");
  if (searchQueryWords.length < 2) {
    setNotBusy();
    errorMessage.value = true;
    phraseErrorMessage.value = "Sökfrasen måste innehålla minst två ord.";
    return;
  }
  errorMessage.value = false;
  phraseErrorMessage.value = "";
  store.phrase = searchQuery.value;
  router.push({ name: 'reuse-phrase', params: { phrase: searchQuery.value, author: store.author?.id, work: store.work?.id } });//.then(() => { router.go(0); });
}

function onClearPhrase() {
  errorMessage.value = false;
  phraseErrorMessage.value = "";
  searchQuery.value = "";
  hasQuery.value = false;
  store.phrase = undefined;
  console.log("Clear phrase");
}

// Search for authors given an id
async function searchAuthor(query: string) {
  // sort authors so that authors that are disabled are at the bottom
  // if in text reuse
  if (route.path.startsWith('/reuse/')) {
    
  let allAuthors = authors.sort((x, y) => collator.compare(x.formatted_name || "", y.formatted_name || ""))
    .map((b) => {
      return {
        ...b,
        disabled: !hasReuse(b)
      }
    });
    let authors_without_reuse = allAuthors.filter((a) => !hasReuse(a));
    let authors_with_reuse = allAuthors.filter((a) => hasReuse(a));
    return authors_with_reuse.concat(authors_without_reuse);
  } else {
    return authors.sort((x, y) => collator.compare(x.formatted_name || "", y.formatted_name || ""));
  }
}

// Search for works given for example an author id
async function searchWork(query: string, params: any) {
  if (params.main_author) {
    const subset = works.filter((w) => w.main_author === params.main_author);
    workCount.value = subset.length;
    return subset;
  }
  return works;
}

function hasReuse(author: any) {
  if (author) {
    return reuseAuthors["ids"].includes(author.id);
  }
  return false;
}

// Callbacks
// After selecting
async function onSelectAuthor1(value: Author, select$: any) {
  // clear graph
  errorMessage.value = false;

  workSelect.value.clearSearch();

  // Update the work count
  countWorks();

  // Set global store value
  store.author = value;

  workSelect.value.refreshOptions();
  searchQuery.value = "";
  hasQuery.value = false;
  store.phrase = undefined;
}

async function onSelectAuthor2(value: Author, select$: any) {
  workSelect.value.clearSearch();
  store.work = undefined;

  // Set global store value
  store.author2 = value;
  searchQuery.value = "";
  hasQuery.value = false;
  store.phrase = undefined;
  if (store.author2 !== value) {
    author2changed = true;
  }
}

async function onSelectWork(value: Work, select$: any) {
  // Fetch the current work and full author
  errorMessage.value = false;
  const author = await get<Author>(value.main_author, "author");
  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();
  console.log(author);
  // Set global store value
  store.work = value;
  store.author = author;
  searchQuery.value = "";
  store.phrase = undefined;
  hasQuery.value = false;
}

function countWorks() {
  /*
  list<Work>("work/19th_century", {
    main_author: store.author?.id,
    limit: 50
  }).then((w) => {
    workCount.value = w.count;
  });
  */
  workCount.value = works.filter((w) => w.main_author === store.author?.id).length || works.length;
}

// After clearing
function onClearAuthor1(event: undefined) {
  store.author = undefined;
  store.work = undefined;
  countWorks();
  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();
  onClearAuthor2(event);
}

function onClearAuthor2(event: undefined) {
  store.author2 = undefined;
  store.work = undefined;
  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();
  author2changed = true;
}

function onClearWork(event: undefined) {
  store.work = undefined;
  workSelect.value.refreshOptions();
}

onMounted(() => {
  countWorks();
});

//watch if route = gallery. if so, show slider
watch(() => route.path, (path) => {
  if (path.startsWith('/gallery')) {
    showSearch.value = true;
    showReuseSearch.value = false;
    showSlider.value = true;
    showWelcome.value = false;
    authorSelect.value.refreshOptions();
  }
  else if (path.startsWith('/reuse/')) {
    showSearch.value = true;
    showReuseSearch.value = true;
    showSlider.value = false;
    showWelcome.value = false;
    if (path.startsWith('/reuse/phrase/')) {
      searchQuery.value = route.params.phrase;
    }
    authorSelect.value.refreshOptions();
  }

  else if (path === '/about/') {
    showSearch.value = false;
    showWelcome.value = true;
  }
  else if (path === '/') {
    showSearch.value = false;
    showWelcome.value = true;
  }
})
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style scoped>
a:link {
  color: white;
  text-decoration: none;
}

a:visited {
  text-decoration: none;
  color: white;
  text-decoration-style: none;
}

a:hover {}

.multiselect-input {
  margin-bottom: 0.5rem;
  margin-left: 2.5rem;
  margin-right: 2.5rem;
}

.search-box {
  width: 100% !important;

}

input[type="search"] {
  font-family: "Barlow Condensed", sans-serif !important;
  background-color: rgba(255, 255, 255, 0.9) !important;
  font-size: 1.4em !important;
  border: none;
  color: black;
  margin-top: 0px;
  margin-bottom: 5px;
  flex: 1;
  border-radius: 8px;
  padding: 10px 15px;
}

input[type="search"]::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

input[type="search"]:focus {
  outline: none;
}

input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  height: 0.75em;
  width: 0.75em;
  border-radius: 50em;
  background: url(../assets/interface/input-cancel-x.svg) no-repeat 50% 50%;
  background-size: contain;
  opacity: 1.0;
  pointer-events: none;
}

input[type="search"]:focus::-webkit-search-cancel-button {
  opacity: 1.0;
  pointer-events: all;
}

.slider-container {
  margin-left: 1rem;
}

.slider-input {
  margin-top: 1rem;
  margin-left: 1.5rem;
  margin-right: 2.5rem;
  font-size: 2em;
}

.sliderColor {
  --slider-connect-bg: var(--theme-accent-color);
  --slider-tooltip-bg: var(--theme-accent-color);
  --slider-tooltip-font-size: 0.65em;
  --slider-tooltip-py: 5px;
  --slider-tooltip-px: 6px;
  --slider-handle-ring-color: rgba(0, 0, 0, 0);
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
  border-color: var(--theme-accent-color);
  border-width: 1px 0 0 0;
  margin-top: 2rem;
  padding: 2rem 0 0 0;
}



.button-container {
  width: 100%;
  float: left;

  margin-bottom: 1.5rem;
}

.search-button {
  font-family: "Barlow Condensed", sans-serif !important;
  padding: 0.25rem 1rem;
  font-size: 25px;
  color: white;
  background-color: var(--theme-accent-color);
  border-color: none !important;
  border-radius: 10px;
  border: 0px solid transparent !important;

  position: relative;
  margin-left: -00px;
  overflow: hidden !important;
}

.search-button2 {
  font-family: "Barlow Condensed", sans-serif !important;
  padding: 0.25rem 1rem;
  display: inline;
  font-size: 25px;
  color: white;
  background-color: var(--theme-accent-color);
  border-color: none !important;
  border-radius: 10px;
  border: 0px solid transparent !important;
  cursor: pointer;
  position: relative;
  margin-left: -00px;
  overflow: hidden !important;
}

button {
  color: white;
  overflow: hidden;
}

button:hover {
  color: white;
  overflow: hidden;
}


.search-button:hover {
  transform: scale(1.05);
  background-color: var(--theme-accent-color-dark) !important;

}

.multiselect {
  color: rgb(60, 40, 40);
  --ms-bg: rgba(255, 255, 255, 0.95);
  --ms-ring-width: 0px;
  --ms-border-width: 0px;
  --ms-font-size: 1.3rem;
  --ms-radius: 8px;
  --ms-option-color-pointed: black;
  --ms-option-bg-selected: var(--theme-accent-color);
  --ms-option-font-size: 1.2rem;
  --ms-option-line-height: 1.375;
  --ms-option-bg-pointed: rgb(230, 230, 230);
  --ms-option-color-pointed: Black;

  --ms-option-color-selected: #fff;
  /*--ms-option-bg-disabled: black;*/
  --ms-option-color-disabled: #d1d5db;
  --ms-option-bg-selected-pointed: var(--theme-accent-color);
  --ms-option-color-selected-pointed: #ffffff;
  --ms-option-bg-selected-disabled: black;
  --ms-option-color-selected-disabled: #d1fae5;
}

.connection {
  border-style: dotted;
  border-color: var(--theme-accent-color-dark);
  border-image-source: url(@/assets/dots.svg);
  border-image-slice: 100% 25%;
  border-image-repeat: round;
  border-width: 0px 0px 20px 0px;
  width: 220px;
  height: 0px;
  float: right;
  left: 155px;
  top: 45px;
}

.errormessage {
  color: var(--theme-accent-color-dark);
  font-weight: bold;
  margin-left: 5px;
}
@media screen and (max-width: 950px) {
  .connection {
    display: none;
  }

  .select-label {
    font-size: 25px !important;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }

  .count-label {
    font-size: 25px !important;
  }


  .multiselect {
    --ms-font-size: 2.2rem;
    --ms-option-font-size: 1.8rem;
  }

  .search-button {
    font-size: 35px;
    border-color: none !important;
    border: 0px solid transparent !important;
  }
}
</style>
