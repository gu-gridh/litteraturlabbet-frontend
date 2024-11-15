<template>

  <div id="gallery-container" v-show="!showOverlay">
    <div class="module-title">
      <h1 style="top:30px;  font-size:2.0em!important; font-weight:100!important; z-index:1000; line-height:inherit;">
        Grafiska element</h1>
    </div>
    <div class="module-content">
      <div v-if="!isExpanded">
        <p>
          I litteraturen finner vi grafiska element i form av figurer, ornament, anfanger och musiknoter.
          Med detta verktyg kan vi extrahera dessa element antingen från författare och enskilda verk, eller från all
          litteratur under ett eller flera årtionden.
          Detta ger oss en grafisk ingång till litteraturen, och ett redskap att synliggöra förändring med. De grafiska
          elementen är sorterade kronologiskt.
        </p>
      </div>
      <div v-if="isExpanded">
        <p>
          Bilderna har extraherats automatiskt från de olika verken med AI-teknik. AI:n har tränats på på verk från
          1800-talet där bilder blivit manuellt utmärkta. Det gör att modellen kan förutse plats och typ av
          illustrationer och skära ut bilderna digitalt. Manuell granskning har skett efteråt. De närmaste grannarna,
          alltså de mest lika unika bilderna, beräknas även de fram med en form av AI-teknik.
          Samtliga bilder har fri upphovsrätt. För att läsa mer om teknikerna som använts, se <a
            href="https://github.com/gu-gridh/litteraturlabbet-frontend" style="font-style: italic; font-weight: 500;"
            target="_blank">GitHub</a>.
        </p>
      </div>
      <button id="readmore" @click="toggleContent">{{ isExpanded ? 'Om verktyget' : 'Om metoden' }}</button>
    </div>
    <div class="gallery-labels-container">
      <div class="gallery-labels">
        <button v-for="label in galleryLabels" :key="label" :id="label" @click="setLabel(label)">{{ label }}</button>
      </div>
      <!--
      <div class="filtering-labels">
        <button :class="[store.imageTag == '' ? 'reset-button disabled' : '', 'reset-button']" @click="resetTag()">Rensa
          tagg
          sök</button>
      </div>
      -->
      <!--<button @click="reverseOrder">Reverse order</button>-->
    </div>
    <div>
      <!-- No images to show -->
      <div v-if="images.length === 0" class="no-images module-content">
        <p>Inga bilder att visa.</p>
      </div>
    </div>
    <div class="gallery are-images-unloaded" v-show="!showOverlay">
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
      <div v-for="item in images" :key="item.id" class="gallery__item">
        <div class="item-info">
          <div class="item-info-meta">
            <h5>{{ item.lb_title || item.title }}</h5>
            <h6>{{ item.author }}</h6>
            <h7 v-if="item.label_sv !== 'ornament' && item.label_sv !== 'anfanger'">{{ item.year }}</h7>
          </div>
        </div>
        <div class="image-wrapper">
          <img :src="`${item.iiif_file}/full/250,/0/default.jpg`" loading="lazy" @click="activateOverlay(item)" />
        </div>
      </div>
    </div>
  </div>


  <ImageViewer v-if="showOverlay" @unshow="deactivateOverlay" @navigate="parentNavigate" @tagClicked="updateTag"
    :imageId="selectedImageId" />
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, onBeforeMount } from "vue";
import Masonry from 'masonry-layout';
import InfiniteScroll from 'infinite-scroll';
import imagesLoaded from 'imagesloaded';
import { useRoute, useRouter } from 'vue-router';
import ImageViewer from "../views/ImageViewer.vue";
import type { ImageI } from "@/types/litteraturlabbet";
import { searchStore } from "@/stores/search";
import { setBusy, setNotBusy } from "./Waiter.vue";

const selectedImageId = ref("");
const router = useRouter();
let msnry: any;
let pageIndex = ref(1);
let canIncrement = ref(true);
let infScroll: any;
const images = ref([] as ImageI[]);
const selectedLabel = ref("illustrationer");
const galleryLabels = ["alla", "exlibris", "omslagsbilder", "illustrationer", "musiknoter", "anfanger", "ornament"];
const route = useRoute();
const showOverlay = ref(false);
const isExpanded = ref(false);
// let layoutKey = ref(0);
// let loadedImagesCount = ref(0);
const store = searchStore();

function reverseOrder() {
  console.log("Reverse order from", store.imageOrder);
  store.imageOrder = store.imageOrder === 'ASC' ? 'DESC' : 'ASC';
}

function toggleContent() {
  isExpanded.value = !isExpanded.value;
}

function setLabel(label: string) {
  scrollTo({
    top: 220,
    behavior: 'smooth'
  });
  if (label.toLowerCase() === selectedLabel.value.toLowerCase()) {
    return;
  }
  setBusy();
  selectedLabel.value = label.toLowerCase();
}

function updateTag(tag: string) {
  setLabel("illustrationer");
  store.imageTag = tag;
  console.log("Tag: ", tag);
  store.triggerImageSearch = true;
}

function resetTag() {
  store.imageTag = "";
  console.log("Reset tag");
  history.replaceState(null, '', '/gallery');
  // trigger search
  store.triggerImageSearch = true;
}

onBeforeMount(() => {
  if (route.params.id) {
    selectedImageId.value = route.params.id + "";
    console.log("Selected image id: ", selectedImageId.value);
    //activateOverlay(selectedImageId.value);
    showOverlay.value = true;
  }
  if (store.imageTag) {
    //history.replaceState(null, '', '/gallery/tag/' + store.imageTag);
  }
  if (route.path.includes('/tag/') && !store.imageTag) {
    const tag = route.path.split('/tag/')[1];
    store.imageTag = tag;
  }
});

function parentNavigate(id: string) {
  console.log("Parent navigate: ", id);
  showOverlay.value = false;
  selectedImageId.value = id;
  showOverlay.value = true;
  history.replaceState(null, '', `/gallery/${id}`);
}

const fetchData = async () => {
  try {
    // replace Alla label with empty string for search query so all results are returned
    let searchQuery = 'label_sv='
    // Build the base query based on the selected label
    if (selectedLabel.value !== 'alla' && selectedLabel.value !== 'exlibris') { searchQuery += `${selectedLabel.value}` }
    // Handle use of provnance label in database instead of exlibris
    if (selectedLabel.value === 'exlibris') { searchQuery += 'provenance' }


    // Add additional parameters with proper separators
    const addParam = (paramName: string, value: any) => {
      if (value) {
        //searchQuery += (searchQuery.length === 0) ? '?' : '&'; // Use '?' for first param, '&' for others
        searchQuery += `&${paramName}=${value}`;
      }
    };

    addParam('year_start', store.yearStart ?? 1800);
    addParam('year_end', store.yearEnd ?? 1900);
    addParam('author', store.author?.id); // Use optional chaining for potential undefined author
    addParam('work', store.work?.id); // Use optional chaining for potential undefined work
    addParam('display', 'true'); //Only return images that aren't near duplicates
    if (store.imageTag) {
      addParam('category_sv', store.imageTag);
    }
    //addParam('category_sv', selectedTag.value);
    addParam('order', store.imageOrder ?? 'ASC');
    // change style of selected button to same as on hover style
    const deselectedStyle = window.getComputedStyle(<HTMLElement>document.querySelector("button"));
    const selectedElement = document.getElementById(selectedLabel.value);
    if (selectedElement) {
      selectedElement.style.background = "rgb(162, 60, 0)";
      selectedElement.style.color = "white";
    }

    // filter the selected label from labels list and reset the style on all buttons other buttons
    for (let lbl of galleryLabels.filter(label => label != selectedLabel.value)) {
      document.getElementById(lbl)!.setAttribute('style', deselectedStyle.cssText);
    }
    const urlToFetch = `https://diana.dh.gu.se/api/litteraturlabbet/graphic/?${searchQuery}&page_size=50&depth=3`;
    //const urlToFetch = `http://localhost:8000/api/litteraturlabbet/graphic/?${searchQuery}&page_size=50&depth=3`;
    const res = await fetch(urlToFetch);
    const data = await res.json();
    const newImages = data.results.map((item: ImageI) => ({
      id: item.id ?? null,
      iiif_file: item.iiif_file ?? null,
      page_id: item?.page?.id ?? null,
      page_num: item?.page?.number ?? null,
      work_id: item?.page?.work?.id ?? null,
      lb_id: item?.page?.work?.lbworkid ?? null,
      lb_title: item?.page?.work?.short_title ?? null,
      title: item?.page?.work?.title ?? null,
      year: item?.page?.work?.sort_year ?? null,
      author: item?.page?.work?.main_author?.name ?? null,
      author_id: item?.page?.work?.main_author?.lbauthorid ?? null,
      type: item?.label_sv ?? null,
      label: item?.label_sv ?? null,
      img_file: item.file ?? null,
      correct_file: 'https://data.dh.gu.se/diana/static/litteraturlabbet/original/' + item.extract_id,
      lb_link: 'https://litteraturbanken.se/f%C3%B6rfattare/' + item.page.work.main_author.lbauthorid + '/titlar/' + item.page.work.modernized_title + '/sida/' + item.page.number + '/faksimil'
    }))

    images.value = [...images.value, ...newImages];

    images.value = images.value.sort()


  } catch (error) {
    console.error("Error fetching additional images:", error);
  }
};

const initMasonry = () => {
  const gallery = document.querySelector('.gallery');
  if (!gallery) {
    console.error('gallery element not found.');
    return;
  }


  msnry = new Masonry(gallery, {
    itemSelector: '.gallery_item', // select none at first
    columnWidth: '.gallery__col-sizer',
    gutter: '.gallery__gutter-sizer',
    percentPosition: true,
    stagger: 30,
    // nicer reveal transition
    visibleStyle: { transform: 'translateY(0)', opacity: 1 },
    hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
  });

  // initial items reveal
  imagesLoaded(gallery, function () {
    gallery.classList.remove('are-images-unloaded');
    msnry.options.itemSelector = '.gallery__item';
    let items = gallery.querySelectorAll('.gallery__item');
    msnry.appended(items);
  });

  infScroll = new InfiniteScroll(gallery, {
    path: () => {
      if (canIncrement.value) {
        pageIndex.value++;
      } 
      canIncrement.value = false;
      // replace Alla label with empty string for search query so all results are returned
      let searchQuery = ''
      // Build the base query based on the selected label
      if (selectedLabel.value !== 'alla' && selectedLabel.value !== 'exlibris') { searchQuery += `${selectedLabel.value}` }
      // Handle use of provnance label in database instead of exlibris
      if (selectedLabel.value === 'exlibris') { searchQuery += 'provenance' }


      // Add additional parameters with proper separators
      const addParam = (paramName: string, value: any) => {
        if (value) {
          //searchQuery += (searchQuery.length === 0) ? '?' : '&'; // Use '?' for first param, '&' for others
          searchQuery += `&${paramName}=${value}`;
        }
      };

      addParam('year_start', store.yearStart ?? 1800);
      addParam('year_end', store.yearEnd ?? 1900);
      addParam('author', store.author?.id); // Use optional chaining for potential undefined author
      addParam('work', store.work?.id); // Use optional chaining for potential undefined work
      addParam('display', 'true'); //Only return images that aren't near duplicates
      if (store.imageTag) {
        addParam('category_sv', store.imageTag);
      }
      //addParam('category_sv', selectedTag.value);
      addParam('order', store.imageOrder ?? 'ASC');
      const offset = (pageIndex.value - 1) * 25;
      const url = `https://diana.dh.gu.se/api/litteraturlabbet/graphic/?depth=3&label_sv=${searchQuery}&page_size=25&page=${pageIndex.value}`;
      return url;
    },
    //append: '.gallery__item',
    outlayer: msnry,
    status: '.page-load-status',
    history: false,
    scrollThreshold: 400,
    append: false,
    elementScroll: '#gallery-container',
    //elementScroll: true,
    loadOnScroll: true,
    checkLastPage: true,
  });

  infScroll.on('load', async function (response: any) {
    try {
      let bodyContent = response.querySelector("body").textContent;

      const data = JSON.parse(bodyContent);

      const newImages = data.results.map((item: ImageI) => ({
        id: item.id ?? null,
        iiif_file: item.iiif_file ?? null,
        page_id: item?.page?.id ?? null,
        page_num: item?.page?.number ?? null,
        work_id: item?.page?.work?.id ?? null,
        lb_id: item?.page?.work?.lbworkid ?? null,
        lb_title: item?.page?.work?.short_title ?? null,
        title: item?.page?.work?.title ?? null,
        year: item?.page?.work?.sort_year ?? null,
        author: item?.page?.work?.main_author?.name ?? null,
        author_id: item?.page?.work?.main_author?.lbauthorid ?? null,
        type: item?.label_sv ?? null,
        label: item?.label_sv ?? null,
        img_file: item.file ?? null,
        correct_file: 'https://data.dh.gu.se/diana/static/litteraturlabbet/original/' + item.extract_id,
        lb_link: 'https://litteraturbanken.se/f%C3%B6rfattare/' + item.page.work.main_author.lbauthorid + '/titlar/' + item.page.work.modernized_title + '/sida/' + item.page.number + '/faksimil'
      }));

      images.value = [...images.value, ...newImages];
      pageIndex.value++;

      imagesLoaded('.gallery', () => {
        msnry.reloadItems();
        msnry.layout();
      });
    } catch (e) {
      console.error("JSON Parsing failed or other error: ", e);
    }

    canIncrement.value = true;
  });

};

// const imageLoaded = () => {
//   loadedImagesCount.value++;
//   if (loadedImagesCount.value === images.value?.length) {
//     // refreshMasonry();
//   }
// };

// const refreshMasonry = () => {
//   layoutKey.value++;
// };
function activateOverlay(item: ImageI) {
  setBusy();
  //  router.push({ name: 'image-viewer', params: { id: item.id } });
  selectedImageId.value = item.id + "";
  showOverlay.value = true;
  console.log("Activate");
  //router.push(`/gallery/${item.id}`);
  history.replaceState(null, '', `/gallery/${item.id}`);
}

function deactivateOverlay() {
  // if there are no images, fetch images

  showOverlay.value = false;
  // reset route
  //router.push('/gallery');
  history.replaceState(null, '', '/gallery');
  console.log("Deactivate");
  if (infScroll) {
    infScroll.destroy();
  }
  imagesLoaded('.gallery', () => {
    initMasonry();
  });
}


onMounted(() => {
  fetchData().then(() => {
    imagesLoaded('.gallery', () => {
      initMasonry();
      // msnry.reloadItems();
      // msnry.layout();
      setNotBusy();
    });
  });
});



watch(selectedLabel, async () => {
  images.value = [];
  pageIndex.value = 1;
  canIncrement.value = true;

  if (infScroll) {
    infScroll.destroy();
  }

  await fetchData();

  imagesLoaded('.gallery', () => {
    initMasonry();
    setNotBusy();
  });
});

watch(store.imageTag as unknown as object, async () => {
  images.value = [];
  pageIndex.value = 1;
  canIncrement.value = true;

  if (infScroll) {
    infScroll.destroy();
  }

  await fetchData();

  imagesLoaded('.gallery', () => {
    initMasonry();
    setNotBusy();
  });
});

watch(() => store.triggerImageSearch,
  async () => {
    setBusy();
    showOverlay.value = false;
    console.log("Image search 2");
    images.value = [];
    pageIndex.value = 1;
    canIncrement.value = true;

    // if (infScroll) {
    //   infScroll.destroy();
    // }

    await fetchData();

    imagesLoaded('.gallery', () => {
      //initMasonry();
      msnry.reloadItems();
      msnry.layout();
      setNotBusy();
    });
    store.triggerImageSearch = false;

  });
/*
watch(store.yearEnd, async () => {
  images.value = [];
  pageIndex.value = 1;
  canIncrement.value = true;

  if (infScroll) {
    infScroll.destroy();
  }

  await fetchData();

  imagesLoaded(document.querySelector('.gallery'), () => {
    initMasonry();
  });
});
*/
</script>

<style>
  #gallery-container{
  position: absolute;
  width: 100%;
  padding-left: 10px;
  padding-right: 5px;
  padding-bottom: 200px;
  max-height: calc(100% + 150px); 
  overflow: scroll;
  z-index: 100 !important;
  }

.module-content {
  height: auto;
  font-size: 1.1em;
}

.gallery {
  padding-top: 0px;
  padding-bottom:30px;
  max-height: calc(100% - 35px);
  overflow-y: scroll;
  max-width: 100%;
  margin: 0 auto;
  user-select: none;
  -webkit-user-select: none;
}

#readmore {
  margin-top: 10px;
  border-radius: 4px;
  padding: 4px 10px 4px 10px;
  font-family: "Barlow Condensed", sans-serif !important;
  font-size: 0.9em;
  border: none;
}

@media screen and (min-width: 1500px) {
  .module-content {
    height: 140px;
  }

  .gallery {
   /*  max-height: calc(100% - 25px); */
  }
}

@media screen and (max-width: 1250px) {
  .module-content {
    font-size: 1.0em;

  }
}

@media screen and (max-width: 1200px) {
  .module-content {
/*     height: 170px; */
  }

  .gallery {
  /*   max-height: calc(100% - 55px); */
  }

  #readmore {
    display: none;
  }
}

@media screen and (max-width: 900px) {
  .module-content {
/*     height: 280px; */
    font-size: 1.5em;
    text-align: left;
  }

  .gallery {
  max-height: calc(100% - 30px); 
  }

  #readmore {
    display: block;
  }
}



#readmore:hover {
  background-color: rgb(162, 60, 0);
  color: white;
}

#module-text-smaller {
  font-size: 1.0rem;
  margin-top: 5px;
}

.image-wrapper {
  overflow: hidden;
  display: block;
  width: 100%;
  height: 100%;
}

.image-wrapper img {
  transition: transform 0.2s ease-in-out;
  width: 100%;
  height: auto;
}

.image-wrapper img:hover {
  transform: scale(1.05);
}


@media (max-height: 850px) {
  #gallery-container {
    padding-bottom: 40px;
    height: calc(690px);
  }

  .gallery {
    padding-top: 0px;
  max-height: calc(465px); 
    overflow-y: auto;
    max-width: 100%;
    margin: 0 auto;
    user-select: none;
    -webkit-user-select: none;
  }
}

.no-images {
  width: 100% !important;
  text-align: center;
  margin-top: 10%;
}



.gallery::-webkit-scrollbar {
  display: none;
}

/* reveal gallery after images loaded */
.gallery.are-images-unloaded {
  opacity: 0;
}

.gallery__item,
.gallery__col-sizer {
  width: calc(16.6% - 10px);
}

.gallery__gutter-sizer {
  width: 10px;
}

@media screen and (max-width: 2000px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(16.6% - 8px);
  }
}


@media screen and (max-width: 1800px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(16.6% - 8px);
  }
}

@media screen and (max-width: 1500px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(20% - 8px);
  }
}

@media screen and (max-width: 1200px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(25% - 8px);
  }
}

@media screen and (max-width: 900px) {

  .gallery__item,
  .gallery__col-sizer {
    width: calc(33% - 8px);
  }
}

/* hide by default */
.gallery.are-images-unloaded .image-grid__item {
  opacity: 0;
}

.gallery__item {
  margin-bottom: 10px;
  float: left;
  /* overflow:hidden!important; */
  -webkit-transition-property: none !important;
  -moz-transition-property: none !important;
  -o-transition-property: none !important;
  transition-property: none !important;
}

.gallery__item--height1 {
  height: 140px;
  background: #EA0;
}

.gallery__item--height2 {
  height: 220px;
  background: #C25;
}

.item-info {
  pointer-events: none;
  position: absolute !important;
  height: 100% !important;
  width: 100% !important;
  z-index: 500 !important;
  bottom: 0px;
  transition: all 0.5s ease-in-out;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.0) 0px, rgba(0, 0, 0, 0)50%) !important;
}

.item-info-meta {
  position: absolute;
  color: white;
  bottom: 0px;
  padding: 10px 10px 10px 12px;
  display: none;
  line-height: 1.1;
}

.item-info-meta h5 {
  font-size: 1.1em;
}

.item-info-meta h6 {
  margin-top: 4px;
  font-size: 0.9em;
}

.item-info-meta h7 {
  margin-top: 4px;
  font-size: 0.8em;
}

.gallery__item img {
  display: block;
  max-width: 100%;
  transition: all 0.2s ease-in-out;
}

.gallery__item:hover .item-info {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0px, rgba(0, 0, 0, 0)100%) !important;
}

.gallery__item:hover .item-info-meta {
  display: block;
}

.page-load-status {
  display: none;
  padding-top: 20px;
  border-top: 1px solid #DDD;
  text-align: center;
  color: #777;
}

.gallery-labels-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 1000;
  margin-bottom: 10px;
}

.gallery-labels {
  margin-top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  z-index: 1000;

}

.gallery-labels button {
  margin: 5px;
  padding: 2px 10px 4px 10px;
  border-radius: 4px;
  font-family: "Barlow Condensed", sans-serif !important;
  font-size: 1.1em;
  border: none;
  user-select: none;
  -webkit-user-select: none;
  background-color: white;
  text-transform: capitalize;
}

.gallery-labels button:hover {
  background-color: var(--theme-accent-color);
  color: white;
}

.detailOverlay {
  position: relative;
  width: 2000px;
  height: 700px;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

.filtering-labels {
  margin-top: 0px;
  display: inline;
  justify-content: end;
  align-items: end;
  width: auto;
  z-index: 1000;

}

.reset-button {
  margin: 5px;
  padding: 2px 10px 4px 10px;
  border-radius: 4px;
  font-family: "Barlow Condensed", sans-serif !important;
  font-size: 1.1em;
  border: none;
  user-select: none;
  -webkit-user-select: none;
  background-color: var(--theme-main-color-light);
  text-transform: capitalize;
}

.reset-button:hover {
  background-color: var(--theme-accent-color);
  color: white;
}

.disabled {
  cursor: not-allowed;
  pointer-events: none;
  background-color: #777;
  opacity: 0.5;
}
</style>
