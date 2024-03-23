<template>

  <div id="gallery-container" v-show="!showOverlay">
    <div class="module-title">
      <h1 style="top:30px;  font-size:2.0em!important; font-weight:100!important; z-index:1000; line-height:inherit;">Grafiska element</h1>
    </div>
    <div class="module-content">
      I litteraturen finner vi grafiska element i form av figurer, ornament, anfanger och musiknoter. 
      Med detta verktyg kan vi extrahera dessa element antingen från författare och enskilda verk, eller från all litteratur under ett eller flera årtionden.
      Detta ger oss en grafisk ingång till litteraturen, och ett redskap att synliggöra förändring med. De grafiska elementen är sorterade kronologiskt.
    </div>
    <div class="gallery-labels-container">
     <div class="gallery-labels">
      <button
        v-for="label in galleryLabels"
        :key="label"
        :id="label"
        @click="setLabel(label)"
      >{{ label }}</button>
  </div>
  </div>
   <div>
    <!-- No images to show -->
    <div v-if="images.length === 0" class="module-content">
      <div class="no-result">
      <p>Inga grafiska element att visa.</p>
    </div>
    </div>
   </div>
    <div class="gallery are-images-unloaded" v-show="!showOverlay">
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
      <div v-for="item in images" :key="item.id" class="gallery__item">
        <div class="item-info">
          <div class="item-info-meta">
            <h5>{{ item.lb_title }}</h5>
            <h6>{{ item.author }}</h6>
          </div>
        </div>
        <img :src="`${item.iiif_file}/full/250,/0/default.jpg`" loading="lazy" @click="activateOverlay(item)" />
      </div>
    </div>
  </div>

  
  <ImageViewer v-if="showOverlay" @unshow="deactivateOverlay()" :imageId="selectedImageId"/>
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
const selectedLabel = ref("Alla");
const galleryLabels = ["Alla", "Illustrationer", "Ornament", "Anfanger", "Musiknoter", "Omslagsbilder"];
const route = useRoute();
const showOverlay = ref(false);
// let layoutKey = ref(0);
// let loadedImagesCount = ref(0);
const store = searchStore();

function setLabel(label: string) {
  
  if (label == "Alla") {
    selectedLabel.value = "";
   // history.replaceState(null, '', `/gallery/`);
  } else {
    selectedLabel.value = label;
   // history.replaceState(null, '', `/gallery/${label}`);
  }
  

}
onBeforeMount(() => {
  if (route.params.id) {
    selectedImageId.value = route.params.id+"";
    console.log("Selected image id: ", selectedImageId.value);
    //activateOverlay(selectedImageId.value);
    showOverlay.value = true;
  }
});

const fetchData = async () => {
  try {
    // replace Alla label with empty string for search query so all results are returned
    let searchQuery = 'label_sv='
    // Build the base query based on the selected label
    if (selectedLabel.value !== 'Alla') {
      searchQuery += `${selectedLabel.value}`;
    }

    // Add additional parameters with proper separators
    const addParam = (paramName: string, value: any) => {
      if (value) {
        //searchQuery += (searchQuery.length === 0) ? '?' : '&'; // Use '?' for first param, '&' for others
        searchQuery += `&${paramName}=${value}`;
      }
    };

    addParam('year_start', store.yearStart??1800);
    addParam('year_end', store.yearEnd??1900);
    addParam('author', store.author?.id); // Use optional chaining for potential undefined author
    addParam('work', store.work?.id); // Use optional chaining for potential undefined work

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
    const urlToFetch = `https://diana.dh.gu.se/api/litteraturlabbet/graphic/?${searchQuery}&limit=50&depth=3`;
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
    images.value=images.value.sort()

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
    itemSelector: 'none', // select none at first
    columnWidth: '.gallery__col-sizer',
    gutter: '.gallery__gutter-sizer',
    percentPosition: true,
    stagger: 30,
    // nicer reveal transition
    visibleStyle: { transform: 'translateY(0)', opacity: 1 },
    hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
  });

  // initial items reveal
  imagesLoaded( gallery, function() {
  gallery.classList.remove('are-images-unloaded');
  msnry.options.itemSelector = '.gallery__item';
  let items = gallery.querySelectorAll('.gallery__item');
  msnry.appended( items );

});

  infScroll = new InfiniteScroll( gallery, {
    path: () => {
      if (canIncrement.value) {
        pageIndex.value++;
      }
      canIncrement.value = false;
      /*let searchQuery = ''
      if (selectedLabel.value == 'Alla') { searchQuery = '' }
      else { searchQuery = selectedLabel.value };
      */
      let searchQuery = ''
    // Build the base query based on the selected label
    if (selectedLabel.value !== 'Alla') {
      searchQuery += `${selectedLabel.value}`;
    }

    // Add additional parameters with proper separators
    const addParam = (paramName: string, value: any) => {
      if (value) {
        //searchQuery += (searchQuery.length === 0) ? '?' : '&'; // Use '?' for first param, '&' for others
        searchQuery += `&${paramName}=${value}`;
      }
    };

    addParam('year_start', store.yearStart??1800);
    addParam('year_end', store.yearEnd??1900);
    addParam('author', store.author?.id); // Use optional chaining for potential undefined author
    addParam('work', store.work?.id); // Use optional chaining for potential undefined work

      const offset = (pageIndex.value - 1) * 25;
      const url = `https://diana.dh.gu.se/api/litteraturlabbet/graphic/?depth=3&label_sv=${searchQuery}&limit=25&offset=${offset}`;
      return url;
    },
    //append: '.gallery__item',
    outlayer: msnry,
    status: '.page-load-status',
    history: false,
    scrollThreshold: 800,
    append: false,
    elementScroll: '.gallery',
    //elementScroll: true,
    loadOnScroll: true,
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
  selectedImageId.value = item.id+"";
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

  if (infScroll) {
    infScroll.destroy();
  }

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
  position:absolute;
  width:100%;
  padding-left:10px;
  padding-right:5px;
  padding-bottom:400px;
  height:calc(100% + 200px);
  overflow:hidden;
  z-index:100!important;
}

.no-result{
  width:100%;
  text-align:center;
  margin-top:10%;
}

.gallery {
  padding-top:0px;
  max-height: calc(100%);
  overflow-y: auto;
  max-width: 100%; 
  margin: 0 auto; 
  user-select: none;
  -webkit-user-select: none;
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
  float:left;
  overflow:hidden!important;
  -webkit-transition-property: none!important;
  -moz-transition-property: none!important;
  -o-transition-property: none!important;
  transition-property: none!important;
}

.gallery__item--height1 {
  height: 140px;
  background: #EA0;
}

.gallery__item--height2 {
  height: 220px;
  background: #C25;
}

.item-info{
  pointer-events:none;
  position:absolute!important;
  height:100%!important;
  width:100%!important;
  z-index:500!important;
  bottom:0px;
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
  font-size:1.2em;
}

.item-info-meta h6 {
  margin-top: 4px;
  font-size:1.0em;
}

.gallery__item img {
  display: block;
  max-width: 100%;
  transition: all 0.2s ease-in-out;
}


.gallery__item img:hover {
  display: block;
  transform: scale(1.05);
  filter: brightness(0.8);
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
  width:100%;
  z-index:1000;
  margin-bottom:10px;
}

.gallery-labels {
  margin-top:0px;
  display: flex;
  justify-content: center;
  align-items: center; 
  width:auto;
  z-index:1000;
/*   
  padding:5px 10px;
  background-color:rgba(255,255,255,0.7);
  border-radius:12px;
  -webkit-backdrop-filter: blur(5px); 
  backdrop-filter: blur(5px); */
}

.gallery-labels button {
  margin: 5px;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: "Barlow Condensed", sans-serif !important;
  font-size: 1.1em;
  border: none;
  user-select: none;
  -webkit-user-select: none;
  background-color:white;
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
</style>