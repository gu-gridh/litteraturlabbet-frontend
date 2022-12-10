<template>
  <div class="search-container">
    <div class="multiselect-input" id="author-select">
      <div class="select-label"><p>Välj en författare...</p></div>
      <Multiselect
        v-model="store.author"
        :value="store.author"
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
        v-model="store.work"
        :value="store.work"
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
        :options="async (query: string, select$: any) => searchWork(query, {main_author: store.author?.id})"
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
            author: store.author?.id,
            work: store.work?.id,
          },
        }"
        v-slot="{ href }"
      >
        <button :href="href" class="search-button">Sök</button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Multiselect from "@vueform/multiselect";
import { list, get } from "@/services/diana";
import type { Author, Work } from "@/types/litteraturlabbet";
import { searchStore } from "@/stores/search";

const store = searchStore();
const authorSelect = ref();
const workSelect = ref();
const workCount = ref<number>();

// Search functions
// Search for authors given an id
function searchAuthor(query: string): Promise<Array<Author>> {
  return list<Author>("author", { search: query, limit: 500 }).then((a) => {
    return a.results;
  });
}

// Search for works given for example an author id
function searchWork(query: string, params: object): Promise<Array<Work>> {
  console.log(params);
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
  // workSelect.value.refreshOptions();
  store.work = undefined;

  // Update the work count
  countWorks();

  // Set global store value
  store.author = value;
  workSelect.value.refreshOptions();
}

async function onSelectWork(value: Work, select$: any) {
  // Fetch the current work and full author
  const work = await get<Work>(value.id, "work");
  const author = await get<Author>(work.main_author as number, "author");

  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();

  // Set global store value
  store.work = value;
  store.author = author;
}

function countWorks() {
  list<Work>("work", {
    main_author: store.author?.id,
  }).then((w) => {
    workCount.value = w.count;
  });
}

// After clearing
function onClearAuthor(event: undefined) {
  store.author = undefined;
  store.work = undefined;
  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();
}

function onClearWork(event: undefined) {
  store.work = undefined;
  workSelect.value.refreshOptions();
}

onMounted(() => {
  countWorks();
});
</script>

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

a:hover {
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
  z-index: 1;
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
  padding: 0.4rem 1rem 0.4rem 1rem;
  font-size: 25px;
  color: white;
  background-color: rgb(182, 82, 139);
  border-color: none !important;
  border-radius: 10px;
  border: 0px solid transparent !important;
  margin-bottom: 1.5rem;
  position: absolute;
  margin-left: -30px;
}

button {
  color: white;
  overflow: hidden;
}

.search-button:hover {
  background-color: rgb(233, 102, 176) !important;
 
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

@media screen and (max-width: 950px) {
  .select-label {
    font-size: 25px !important;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }

  .count-label {
    font-size: 25px !important;
  }

  .search-container {
    height: 480px;
  }

  .multiselect {
    --ms-font-size: 2.2rem;
    --ms-option-font-size: 1.8rem;
  }

  .search-button {
    font-size: 35px;
    color: white;
    background-color: rgb(182, 82, 139);
    border-color: none !important;
    border-radius: 10px;
    border: 0px solid transparent !important;
    margin-bottom: 1.5rem;
    position: absolute;
    margin-left: -30px;
  }
}
</style>
