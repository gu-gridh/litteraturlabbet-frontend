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
          <Slider v-model="timeRange" :min="1800" :max="1900" :step="5" class="sliderColor" @update="setTimespan"
            lazy />
        </div>
      </div>

      <div class="multiselect-input" id="author-select">
        <div class="select-label">
          <p>Sök efter författare</p>
        </div>
        <Multiselect v-model="store.author" :value="store.author" mode="single" spellcheck="false"
          :placeholder=dynamicPlaceholder(0) noResultsText="Inga författare matchar sökningen"
          noOptionsText="Inga författare matchar sökningen" :resolve-on-load="true" :delay="1" :searchable="true"
          :object="true" valueProp="id" label="formatted_name"
          :options="async (query: string, select$: any) => searchAuthor(query)" :clear-on-select="true"
          :clear-on-search="true" @select="onSelectAuthor1" @clear="onClearAuthor1" ref="authorSelect" />
        <div class="doubleArrow" v-if="showReuseSearch">
          <!-- <img src="../assets/double-arrow.png" style="margin-left:auto; margin-right: auto; display:block;"/> -->
        </div>
        <div id="author2-select" v-show="showReuseSearch">
          <Multiselect v-model="store.author2" :value="store.author2" mode="single" spellcheck="false"
            :placeholder=dynamicPlaceholder(1) noResultsText="Inga författare matchar sökningen"
            noOptionsText="Inga författare matchar sökningen" :resolve-on-load="true" :delay="1" :searchable="true"
            :object="true" valueProp="id" label="formatted_name"
            :options="async (query: string, select$: any) => searchAuthor2(query)" :clear-on-select="true"
            :clear-on-search="true" :disabled="store.work || !store.author" @select="onSelectAuthor2"
            @clear="onClearAuthor2" ref="authorSelect2" style="margin-top:10px; font-size: 17px; width:100%; white-space: nowrap;" />
        </div>
        <div class="littlabbnotice" v-if="showReuseSearch">
          <p>Du kan begränsa sökningen till att visa återbruk mellan endast två författare. Endast författare med återbrukskopplingar till den valda författaren visas i det andra fältet.</p>
        </div>
      </div>
      <div class="multiselect-input" id="work-select">
        <div class="select-label">
          <p>Sök efter verk</p>
        </div>
        <Multiselect v-model="store.work" :value="store.work" mode="single" spellcheck="false" placeholder="Verk"
          noResultsText="Inga verk matchar sökningen" noOptionsText="Inga verk matchar sökningen"
          :resolve-on-load="true" :delay="1" :searchable="true" :object="true" valueProp="id" label="title"
          :clear-on-select="false" :clear-on-search="false" :disabled="store.author2"
          :options="async (query: string, select$: any) => searchWork(query, { main_author: store.author?.id })"
          @select="onSelectWork" @clear="onClearWork" ref="workSelect" />
      </div>

      <div class="multiselect-input" id="phrase-select" v-show="showReuseSearch">
        <div class="select-label">
          <p>Sök efter en fras</p>
        </div>
        <input type="search" id="search" class="search-box" name="search" spellcheck="false" placeholder="Fras"
          :value="searchQuery" @keydown="handleBackspace" @input="updateSearchQuery" @keydown.enter="triggerSearch"
          @clear="onClearPhrase" />
      </div>
<!--
      <div class="self-reuse-wrapper" id="self-reuse-check" v-show="showReuseSearch">
        <input type="checkbox" id="self-reuse" name="self-reuse" v-model="store.selfReuse" />
        <label for="self-reuse">Inkludera självåterbruk</label>
      </div>
-->
      <div class="multiselect-input" id="tag-select" v-show="showGraphicSearch">
        <!-- Add chips for searching by tags -->
        <div class="select-label">
          <p>Sök efter en tagg</p>
        </div>
        <!-- <div class="tag-organise">
          <div v-for="tag in tags" :key="tag">

            <span class="tag-chip" @click="searchTag(tag)" :class="{ 'active-tag': getIsActive(tag) }">{{ tag }}</span>
          </div>
        </div> -->
        <Multiselect mode="single" spellcheck="false" placeholder="Tagg" noResultsText="Inga taggar matchar sökningen"
          noOptionsText="Inga taggar matchar sökningen" :searchable="true" :clear-on-select="false"
          :clear-on-search="false" :options=tags @select="onSelectTag" @clear="onClearTag" ref="tagSelect"
          v-model=store.imageTag :value="store.imageTag" />
      </div>
      <div class="count-label">
        <p>Totalt {{ workCount }} verk i samlingen.</p>
        <div class="cc-notice" v-if="imageSearch">Alla bilder som visas är licensierade <a
            href='https://creativecommons.org/publicdomain/zero/1.0/deed.sv' target="_blank"> CC0 1.0</a></div>
      </div>

      <div class="button-container">
        <div v-if="imageSearch">
          <div class="search-button2" @click="triggerImageSearch">Sök</div>
        </div>
        <div v-else>
          <div v-if="!hasQuery">
            <div v-if="store.author2">
              <div class="search-button2" @click="triggerSearch1">Sök</div>
            </div>
            <div v-if="!store.author2">
              <div class="search-button2" @click="triggerSearch2">Sök</div>
            </div>
          </div>

          <div v-if="hasQuery">
            <div class="search-button2" @click="triggerSearch">Sök
            </div>
          </div>
        </div>
        <div class="errormessage-container">
          <div v-if="errorMessage">
            <span class="errormessage">{{ phraseErrorMessage }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount } from "vue";
import Multiselect from "@vueform/multiselect";
import Slider from '@vueform/slider'
import { get } from "@/services/littlabb";
import type { Author, Work } from "@/types/litteraturlabbet";
import { searchStore } from "@/stores/search";
import reuseAuthors from "@/assets/authors_with_reuse.json";
import reuseWorks from "@/assets/works_with_reuse.json";
import { useRoute } from 'vue-router'
import Welcome from "@/components/Welcome.vue";
import { works } from "@/assets/works_years.json";
import { authors } from "@/assets/authors_years.json";
import { author_author_reuse } from "@/assets/author_author_reuse_ids.json";
import router from "@/router";
import { setBusy, setNotBusy } from "@/components/Waiter.vue";
import { works_with_graphic } from "@/assets/works_with_graphic.json";
import { authors_with_graphic } from "@/assets/authors_with_graphic.json";

interface AuthorReuse {
  [authorId: string]: number[]
}

const author_author_reuse_typed = author_author_reuse as unknown as AuthorReuse;

const store = searchStore();

const authorSelect = ref();
const authorSelect2 = ref();
const workSelect = ref();
const workCount = ref<number>();

const currentTags = ref([]);

const collator = new Intl.Collator('sv-u-co-trad');

const timeRange = ref([1700, 2025]);

const showSlider = ref(false);
const showReuseSearch = ref(false);
const showSearch = ref(false);
const showWelcome = ref(true);
const showGraphicSearch = ref(false);

const tags = ["fest", "krig och strider", "konst och kultur", "byggnader", "porträtt", "fartyg", "legendariska varelser", "antiken", "kyrkogårdar", "rum och utrymmen", "religion", "fysiska aktiviteter", "militärer", "fordon och båtar", "föremål", "mat och dryck", "vapen", "natur", "frukt", "musikinstrument", "visuella verk", "växter", "landskap", "djur", "inredning", "personer"].sort((a, b) => a.localeCompare(b))

const route = useRoute();

const searchQuery = ref("");
const errorMessage = ref(false);
const hasQuery = ref(false);
let phraseErrorMessage = ref("");

const currentAuthor = ref(-1);
const currentAuthor2 = ref(-1);
const currentWork = ref(-1);

let author2changed = false;

const imageSearch = ref(false);

function onClearTag() {
  store.imageTag = undefined;
}
function onSelectTag(e: any) {
  store.imageTag = e;
}
// dynamic placeholder for author select
// return "Författare" if in gallery, "Författare #1" if in reuse
function dynamicPlaceholder(index: number) {

  if (index === 0) {
    if (route.path.startsWith('/gallery')) {
      return "Författare";
    }
    return "Författare";
  } else if (index === 1) {
    if (store.author) {
      //return "Sök återbruk med...";
     return "Sök återbruk mellan " + store.author.formatted_name.split(",")[0] + " och...";
    } 
    return "";
  }

}
// initialize an empty author object with the given id
function initAuthorId(id: number) {
  const author: Author = {
    id: 0,
    gender: "",
    lbauthorid: "",
    normalized_lbauthorid: "",
    name: "",
    formatted_name: "",
    surname: null,
    birth_year: 0,
    death_year: null,
    created_at: "",
    updated_at: "",
    published: false
  };
  author["id"] = id;
  return author;
}

// initialize an empty work object with the given id
function initWorkId(id: number) {
  const work: Work = {
    title: "",
    short_title: "",
    modernized_title: "",
    lbworkid: "",
    librisid: "",
    main_author: initAuthorId(-1),
    edition: "",
    language: "",
    imprint_year: 0,
    sort_year: 0,
    word_count: 0,
    authors: [],
    pages: [],
    id: 0,
    created_at: "",
    updated_at: "",
    published: false
  };
  work["id"] = id;
  return work;
}

onBeforeMount(() => {
  //console.log("Before mount");
  // open the correct collection search based on route
  if (route.path.startsWith('/reuse/')) {
    // set placeholder for authorSelect to Författare #1 if in reuse
    authorSelect.value.setPlaceholder("Författare #1");
    showSearch.value = true;
    showReuseSearch.value = true;
    showGraphicSearch.value = false;
    showSlider.value = false;
    showWelcome.value = false;
    if (route.path.startsWith('/reuse/phrase/')) {
      searchQuery.value = <string>route.params.phrase;
    }
    if (route.path.match(/reuse\/\d+\/\d+/)) {
      //console.log(route.params);
      store.author = initAuthorId(parseInt(route.params.author + ""));
      store.work = initWorkId(parseInt(route.params.work + ""));
      currentAuthor.value = store.author!.id;
      currentAuthor2.value = -1;
      currentWork.value = store.work!.id;
    } else if (route.path.match(/reuse\/\d+/)) {
      store.author = initAuthorId(parseInt(route.params.id + ""));
      currentAuthor.value = store.author!.id;
      currentAuthor2.value = -1;
      currentWork.value = -1;
    } else if (route.path.match(/reuse\/link\/\d+\/\d+/)) {
      store.author = initAuthorId(parseInt(route.params.id1 + ""));
      store.author2 = initAuthorId(parseInt(route.params.id2 + ""));
      currentAuthor.value = store.author!.id;
      currentWork.value = -1;
      currentAuthor2.value = store.author2!.id;
    }
    authorSelect.value.refreshOptions();
    workSelect.value.refreshOptions();
  }
  else if (route.path.startsWith('/gallery')) {
    showSearch.value = true;
    showReuseSearch.value = false;
    showGraphicSearch.value = true;
    showSlider.value = true;
    showWelcome.value = false;
    authorSelect.value.refreshOptions();
  }
  else if (route.path === '/about/') {
    showSearch.value = false;
    showWelcome.value = true;
    showGraphicSearch.value = false;
  }
  else if (route.path === '/') {
    showSearch.value = false;
    showWelcome.value = true;
    showGraphicSearch.value = false;
  }
});

function setTimespan() {
  store.yearStart = timeRange.value[0];
  store.yearEnd = timeRange.value[1];
  //console.log("Setting timespan to", timeRange.value[0], timeRange.value[1]);
  // filter authors
  authorSelect.value.refreshOptions();
  // filter works
  workSelect.value.refreshOptions();
}

function handleBackspace(event: KeyboardEvent) {
  if (event.key === "Backspace") {
    if (searchQuery.value.length === 0) {
      store.phrase = undefined;
      hasQuery.value = false;
      event.preventDefault();
    }
  }
}

function updateSearchQuery(e: any) {
  store.phraseResults = undefined;
  const value = e["target"]["value"];
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
  // Update the work count
  countWorks();
}

// Search functions    
function triggerImageSearch() {
  scrollTo({
    top: 220,
    behavior: 'smooth'
  });
  //console.log("Image search");
  // emit event
  router.push({ name: 'image-advanced-search', params: { author: store.author?.id, work: store.work?.id, tag: store.imageTag } });
  store.triggerImageSearch = true;
}

async function triggerSearch1() {
  scrollTo({
    top: 220,
    behavior: 'smooth'
  });
  setBusy();
  if (store.author?.id === currentAuthor.value && store.author2?.id === currentAuthor2.value) {
    setNotBusy();
    errorMessage.value = true;
    phraseErrorMessage.value = "Du har redan sökt efter denna kombination.";
    return;
  }
  errorMessage.value = false;
  //console.log(store.author?.id, store.author2?.id);
  router.push({ name: 'reuse-link', params: { id1: store.author?.id, id2: store.author2?.id } });//.then(() => { router.go(0) });
  currentAuthor.value = store.author!.id;
  currentAuthor2.value = store.author2!.id;
}

async function triggerSearch2() {
  scrollTo({
    top: 220,
    behavior: 'smooth'
  });
  setBusy();
  if (!store.author) {
    setNotBusy();
    errorMessage.value = true;
    // error message that you need to select an author, two authors, a work, or a phrase
    phraseErrorMessage.value = "Du måste välja en eller två författare, en författare och ett verk eller en fras.";
    return;
  }
  if (store.author?.id === currentAuthor.value) {
    //console.log(store.work?.id, currentWork.value);
    if (store.work) {
      if (store.work?.id === currentWork.value) {
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
  const searchQueryChars = searchQuery.value;
  if (searchQueryChars.length < 2) {
    setNotBusy();
    errorMessage.value = true;
    phraseErrorMessage.value = "Sökfrasen måste innehålla minst två bokstäver.";
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
  store.phraseResults = undefined;
}

function workHasGraphic(work: any) {
  if (work) {
    const numid = parseInt(work.id);
    return works_with_graphic.indexOf(numid) > -1;
  }
  return false;
}

function hasGraphic(author: any) {
  if (author) {
    const numid = parseInt(author.id);
    return authors_with_graphic.indexOf(numid) > -1;
  }
  return false;
}

async function searchAuthor2(query: string) {
  if (route.path.startsWith('/reuse/')) {
    if (store.author) {
      // find all authors that have reuse with the current author
      const v = author_author_reuse_typed[store.author!.id + ""];
      // filter all authors for authors whose id is in v
      const authors2 = authors.filter((a) => v.includes(parseInt(a.id)));
      return authors2;
    }
  }
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
    if (store.yearStart) {
      authors_without_reuse = authors_without_reuse.filter((a) => parseInt(a.min_year) >= store.yearStart!);
      authors_with_reuse = authors_with_reuse.filter((a) => parseInt(a.min_year) >= store.yearStart!);
    }
    if (store.yearEnd) {
      authors_without_reuse = authors_without_reuse.filter((a) => parseInt(a.max_year) <= store.yearEnd!);
      authors_with_reuse = authors_with_reuse.filter((a) => parseInt(a.max_year) <= store.yearEnd!);
    }
    return authors_with_reuse.concat(authors_without_reuse);
  } else if (route.path.startsWith('/gallery')) {
    let allAuthors = authors.sort((x, y) => collator.compare(x.formatted_name || "", y.formatted_name || ""))
      .map((b) => {
        return {
          ...b,
          disabled: !hasGraphic(b)
        }
      });
    let authors_without_graphic = allAuthors.filter((a) => !hasGraphic(a));
    let authors_with_graphic = allAuthors.filter((a) => hasGraphic(a));
    if (store.yearStart) {
      authors_without_graphic = authors_without_graphic.filter((a) => parseInt(a.min_year) >= store.yearStart!);
      authors_with_graphic = authors_with_graphic.filter((a) => parseInt(a.min_year) >= store.yearStart!);
    }
    if (store.yearEnd) {
      authors_without_graphic = authors_without_graphic.filter((a) => parseInt(a.max_year) <= store.yearEnd!);
      authors_with_graphic = authors_with_graphic.filter((a) => parseInt(a.max_year) <= store.yearEnd!);
    }
    return authors_with_graphic.concat(authors_without_graphic);
  } else {
    return authors.sort((x, y) => collator.compare(x.formatted_name || "", y.formatted_name || ""));
  }
}

// Search for works given for example an author id
async function searchWork(query: string, params: any) {
  //console.log("Loading works with params", params);
  if (route.path.startsWith("/reuse")) {
    if (params.main_author) {
      const pma = params.main_author + "";
      console.log("Pre-filtering works for author", pma);
      let subset = works.filter((w) => w.main_author === pma);
      console.log("Subset length", subset.length);
      if (store.yearStart) {
        subset = subset.filter((w) => parseInt(w.imprint_year) >= store.yearStart!);
      }
      if (store.yearEnd) {
        subset = subset.filter((w) => parseInt(w.imprint_year) <= store.yearEnd!);
      }
      workCount.value = subset.length;
      subset = subset.map((w) => {
        return {
          ...w,
          disabled: !workHasReuse(w)
        }
      });
      const subset_without_reuse = subset.filter((w) => !workHasReuse(w));
      const subset_with_reuse = subset.filter((w) => workHasReuse(w));
      return subset_with_reuse.concat(subset_without_reuse);
    }
    let subset = works;
    if (store.yearStart) {
      subset = subset.filter((w) => parseInt(w.imprint_year) >= store.yearStart!);
    }
    if (store.yearEnd) {
      subset = subset.filter((w) => parseInt(w.imprint_year) <= store.yearEnd!);
    }
    workCount.value = subset.length;
    subset = subset.map((w) => {
      return {
        ...w,
        disabled: !workHasReuse(w)
      }
    });
    const subset_without_reuse = subset.filter((w) => !workHasReuse(w));
    const subset_with_reuse = subset.filter((w) => workHasReuse(w));
    return subset_with_reuse.concat(subset_without_reuse);
  } else if (route.path.startsWith("/gallery")) {
    if (params.main_author) {
      const pma = params.main_author + "";
      let subset = works.filter((w) => w.main_author === pma);
      if (store.yearStart) {
        subset = subset.filter((w) => parseInt(w.imprint_year) >= store.yearStart!);
      }
      if (store.yearEnd) {
        subset = subset.filter((w) => parseInt(w.imprint_year) <= store.yearEnd!);
      }
      workCount.value = subset.length;
      subset = subset.map((w) => {
        return {
          ...w,
          disabled: !workHasGraphic(w)
        }
      });
      const subset_without_reuse = subset.filter((w) => !workHasGraphic(w));
      const subset_with_reuse = subset.filter((w) => workHasGraphic(w));
      return subset_with_reuse.concat(subset_without_reuse);
    }
    let subset = works;
    if (store.yearStart) {
      subset = subset.filter((w) => parseInt(w.imprint_year) >= store.yearStart!);
    }
    if (store.yearEnd) {
      subset = subset.filter((w) => parseInt(w.imprint_year) <= store.yearEnd!);
    }
    workCount.value = subset.length;
    subset = subset.map((w) => {
      return {
        ...w,
        disabled: !workHasGraphic(w)
      }
    });
    const subset_without_reuse = subset.filter((w) => !workHasGraphic(w));
    const subset_with_reuse = subset.filter((w) => workHasGraphic(w));
    return subset_with_reuse.concat(subset_without_reuse);
  } else {
    return works;
  }
}

function hasReuse(author: any) {
  if (author) {
    const numid = parseInt(author.id);
    return reuseAuthors["ids"].includes(numid);
  }
  return false;
}

function workHasReuse(work: any) {
  if (work) {
    const numid = parseInt(work.id);
    return reuseWorks["wids"].includes(numid);
  }
  return false;
}

// Callbacks
// After selecting
async function onSelectAuthor1(e: any) {
  // previous params value: Author, select$: any
  const value = { ...e };
  // clear graph
  errorMessage.value = false;
  store.work = undefined;
  workSelect.value.clearSearch();

  // Update the work count
  countWorks();

  // Set global store value
  store.author = value;

  workSelect.value.refreshOptions();
  searchQuery.value = "";
  hasQuery.value = false;
  store.phrase = undefined;
  // reset authorSelect2
  store.author2 = undefined;

  authorSelect2.value.refreshOptions();
}

async function onSelectAuthor2(e: any) {
  const value = { ...e };
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

async function onSelectWork(e: any) {
  const value = { ...e };
  console.log(value);
  // Fetch the current work and full author
  errorMessage.value = false;
  const author = await get<Author>(value.main_author, "author");
  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();
  //console.log(author);
  // Set global store value
  store.work = value;
  store.author = author;
  searchQuery.value = "";
  store.phrase = undefined;
  hasQuery.value = false;
}

function countWorks() {
  workCount.value = works.filter((w) => parseInt(w.main_author) === store.author?.id).length || works.length;
}

// After clearing
function onClearAuthor1() {
  store.author = undefined;
  store.work = undefined;
  countWorks();
  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();
  onClearAuthor2();
}

function onClearAuthor2() {
  store.author2 = undefined;
  store.work = undefined;
  workSelect.value.clearSearch();
  workSelect.value.refreshOptions();
  author2changed = true;
}

function onClearWork() {
  store.work = undefined;
  workSelect.value.refreshOptions();
}

onMounted(() => {
  countWorks();
  // trigger a reload of works shortly after component is mounted
  // to correctly gray out works from the start
  setTimeout(() => {
    searchWork("", { main_author: store.author?.id });
    workSelect.value.refreshOptions();
  }, 100);
});


watch(() => route.path, (path) => {
  if (path.startsWith('/gallery')) {
    showSearch.value = true;
    showReuseSearch.value = false;
    showGraphicSearch.value = true;
    showSlider.value = true;
    showWelcome.value = false;
    authorSelect.value.refreshOptions();
    imageSearch.value = true;
    workSelect.value.refreshOptions();
  }
  else if (path.startsWith('/reuse/')) {
    showSearch.value = true;
    showReuseSearch.value = true;
    showGraphicSearch.value = false;
    showSlider.value = false;
    showWelcome.value = false;
    if (path.startsWith('/reuse/phrase/')) {
      searchQuery.value = <string>route.params.phrase;
    }
    authorSelect.value.refreshOptions();
    imageSearch.value = false;
    workSelect.value.refreshOptions();
  }

  else if (path === '/about/') {
    showSearch.value = false;
    showWelcome.value = true;
    showGraphicSearch.value = false;
    imageSearch.value = false;
  }
  else if (path === '/') {
    showSearch.value = false;
    showGraphicSearch.value = false;
    showWelcome.value = true;
    imageSearch.value = false;
  }
})
</script>

<style src="@vueform/slider/themes/default.css"></style>

<style scoped>
.littlabbnotice {
  font-size: 0.9em;
  line-height: 1.1;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--theme-accent-color);
}
.tag-organise {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
}

.tag-chip {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  background-color: grey;
  color: white;
  cursor: pointer;
}

.tag-chip:hover {
  transform: scale(1.15);
}

.active-tag {
  background-color: var(--theme-accent-color-dark);
  cursor: pointer;
}

a:link {
  color: white;
  text-decoration: none;
}

a:visited {
  text-decoration: none;
  color: white;
  text-decoration-style: none;
}

.cc-notice a:link {
  color: black;
  text-decoration: none;
}


.cc-notice a:visited {
  color: black;
  text-decoration: none;
}

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

input[type="checkbox"] {
  margin-top: 0rem;
  margin-left: 2rem;
  margin-right: 0.5rem;
  font-size: 2em;
}

#self-reuse-check {
  margin-top: 0.0rem;
  margin-left: 0.5rem;
  margin-right: 2.0rem;
  font-size: 1.2em;
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
  padding: 1.5rem 0 0 0;
}

.button-container {
  width: 100%;
  float: left;
  margin-bottom: 2.0rem;
}

.search-button {
  font-family: "Barlow Condensed", sans-serif !important;
  padding: 0.25rem 1rem;
  font-size: 25px;
  color: white;
  background-color: var(--theme-accent-color);
  border-color: none !important;
  border-radius: 8px;
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
  border-radius: 8px;
  border: 0px solid transparent !important;
  cursor: pointer;
  position: relative;
  margin-left: -00px;
  overflow: hidden !important;
}

.doubleArrow {
  margin-top: 4px;
  margin-bottom: -6px;
  height: 20px;
  width: 45px;
  align-content: center;
  border-width: 0px 1.5px 0px 0px;
  border-style: dotted;
  border-color: var(--theme-accent-color);
}

button {
  color: white;
  overflow: hidden;
}

button:hover {
  color: white;
  overflow: hidden;
  background-color: var(--theme-accent-color-dark);
}

.search-button:hover {
  transform: scale(1.05);
  background-color: var(--theme-accent-color-dark) !important;
}

.search-button2:hover {
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
  --ms-line-height:1;
}

.errormessage-container {
  color: var(--theme-accent-color-dark);
  text-align: center;
  width: 80%;
  font-size: 1.1em;
  line-height: 1.1 !important;
}

.errormessage {
  font-weight: bold !important;
  top: 10px;
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
