<template>

  <div id="gallery-container">
   
     <div class="gallery-labels">
      <button
        v-for="label in galleryLabels"
        :key="label"
        @click="selectedLabel = label"
      >
        {{ label }}
      </button>
  
    </div>
   
    <div class="gallery">
      <div class="gallery__col-sizer"></div>
      <div class="gallery__gutter-sizer"></div>
    <div v-for="item in images" :key="item.id" class="gallery__item">
        <div class="item-info">
            <div class="item-info-meta">
              <h4>{{ item.title }}</h4>
              <h5>{{ item.author }}</h5>
            </div>
        </div>
        <img 
          :src="`${item.iiif_file}/full/250,/0/default.jpg`" 
          loading="lazy" 
        />
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, defineComponent, watch } from "vue";
import Masonry from 'masonry-layout';
import InfiniteScroll from 'infinite-scroll';
import imagesLoaded from 'imagesloaded';
import { storeToRefs } from "pinia";

let msnry;
let pageIndex = ref(1);
let canIncrement = ref(true);
let infScroll;
const images = ref([]);
const selectedLabel = ref("");
const galleryLabels = ["Alla", "Illustrationer", "Ornament", "Anfanger", "Musiknoter", "Omslagsbilder"];
const diana = inject("diana") as DianaClient;

// let layoutKey = ref(0);
// let loadedImagesCount = ref(0);

const fetchData = async () => {
    try {
      let searchQuery = ''
      if (selectedLabel.value == 'Alla') {searchQuery = ''}
      else {searchQuery = selectedLabel.value}
      const urlToFetch = `https://diana.dh.gu.se/api/litteraturlabbet/graphic/?label_sv=${encodeURIComponent(searchQuery)}&limit=25&depth=3`;
      const res = await fetch(urlToFetch);
      const data = await res.json(); 
      const newImages = data.results.map(item => ({
          id: item.id ?? null,
          iiif_file: item.iiif_file ?? null,
          page_id: item?.page?.id ?? null,
          page_num: item?.page?.number ?? null,
          work_id: item?.page?.work?.id ?? null,
          lb_id: item?.page?.work?.lbworkid ?? null,
          lb_title: item?.page?.work?.modernized_title ?? null,
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
        itemSelector: '.gallery__item',
        columnWidth: '.gallery__col-sizer',
        gutter: '.gallery__gutter-sizer',
        percentPosition: true,
      });

      infScroll = new InfiniteScroll(gallery, {
        path: () => {
          if (canIncrement) {
            pageIndex.value++;
          }
          canIncrement.value = false;
          let searchQuery = ''
      if (selectedLabel.value == 'Alla') {searchQuery = ''}
      else {searchQuery = selectedLabel.value};
          const offset = (pageIndex.value - 1) * 25;
          const url = `https://diana.dh.gu.se/api/litteraturlabbet/graphic/?depth=3&id=&uuid=&label_en=&label_sv=${encodeURIComponent(searchQuery)}&score=&limit=25&offset=${offset}`;
          return url; 
        },
        outlayer: msnry,
        status: '.page-load-status',
        history: false,
        scrollThreshold: 1200,
        elementScroll: true,
      });

    infScroll.on('load', async function(response) {
      try {
        let bodyContent = response.querySelector("body").textContent;

        const data = JSON.parse(bodyContent);

        const newImages = data.results.map(item => ({
          id: item.id ?? null,
          iiif_file: item.iiif_file ?? null,
        }));

        images.value = [...images.value, ...newImages];

        imagesLoaded(document.querySelector('.gallery'), () => {
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

  onMounted(() => {
  fetchData().then(() => {
    imagesLoaded(document.querySelector('.gallery'), () => {
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

  imagesLoaded(document.querySelector('.gallery'), () => {
    initMasonry();
  });
});


</script>

<style>
#gallery-container{
  position:relative;
  width:100%;
  padding-left:10px;
  padding-right:8px;
  padding-bottom:50px;
  height:calc(100vh - 200px);
  min-height:calc(100vh - 140px);
  overflow:hidden;
  z-index:100!important;
  background-color: white;
}
/* 
@media screen and (min-width: 1900px) {
  #gallery-container{ 
    padding-left:600px;
}
  }

@media screen and (max-width: 1500px) {
  #gallery-container{ 
    padding-left:500px;
}
  }

  @media screen and (max-width: 900px) {
  #gallery-container{ 
    padding-left:5px;
}
  } */

.gallery {
  padding-top:10px;
  max-height: 100%;
  overflow-y: auto;
  max-width: 100%; 
  margin: 0 auto; 
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
.gallery__gutter-sizer { width: 10px;}

@media screen and (max-width: 2000px) {
  .gallery__item, .gallery__col-sizer {
    width: calc(16.6% - 8px);
  }
}


@media screen and (max-width: 1800px) {
  .gallery__item, .gallery__col-sizer {
    width: calc(16.6% - 8px);
  }
}

@media screen and (max-width: 1500px) {
  .gallery__item, .gallery__col-sizer {
    width: calc(20% - 8px);
  }
}

@media screen and (max-width: 1200px) {
  .gallery__item, .gallery__col-sizer {
    width: calc(25% - 8px);
  }
}

@media screen and (max-width: 900px) {
  .gallery__item, .gallery__col-sizer {
    width: calc(33% - 8px);
}
  }

/* hide by default */
.gallery.are-images-unloaded .image-gallery__item {
  opacity: 0;
}

.gallery__item {
  margin-bottom: 10px;
  float: left;
  overflow:hidden !important;
}

.gallery__item--height1 { height: 140px; background: #EA0; }
.gallery__item--height2 { height: 220px; background: #C25; }
.gallery__item--height3 { height: 300px; background: #19F; }

.gallery__item--width2 { width: 66%; }

.item-info{
  pointer-events:none;
  position:absolute!important;
  height:100%!important;
  width:100%!important;
  z-index:1000!important;
  bottom:0px;
  transition: all 0.5s ease-in-out;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.0) 0px, rgba(0, 0, 0, 0)50%) !important;
}

.item-info-meta{
  position:absolute;
  color:white;
  bottom:0px;
  padding:10px 15px;
  display:none;
  line-height:1.1;
}

.item-info-meta h5{
margin-top:10px;
}

.gallery__item img {
  display: block;
  max-width: 100%;
  transition: all 0.2s ease-in-out;
}


.gallery__item img:hover {
  display: block;
  transform:scale(1.05);
}

.gallery__item:hover .item-info{
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0px, rgba(0, 0, 0, 0)50%) !important;
}

.gallery__item:hover .item-info-meta{
 display:block;
}

.page-load-status {
  display: none;
  padding-top: 20px;
  border-top: 1px solid #DDD;
  text-align: center;
  color: #777;
}

.gallery-labels {
  display: flex;
  justify-content: center;
  align-items: center; 
  width:100%;
}

.gallery-labels button {
  margin: 5px;
  margin-bottom:20px;
  padding: 4px 10px;
  border-radius: 4px;
  font-family: "Barlow Condensed", sans-serif !important;
  font-size: 15px;
  border: none;
}

.gallery-labels button:hover {
  background-color: var(--theme-accent-color);
  color: white;
}

</style>