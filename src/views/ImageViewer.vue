<template>
  <div class="container">
    <div id="viewer">
      <div id="ToolbarVertical">
        <!--<div class="close-button NavButton" onclick="history.back()">
          -->
        <div class="close-button NavButton" @click="unshowSelf()" title="Stäng">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="-2 -2 28 28"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <!-- <a id="full-page" href="#full-page">
              <div id="FullPage" class="NavButton"></div>
            </a> -->
        <a id="zoom-in" href="#zoom-in">
          <div id="ZoomIn" class="NavButton" title="Zooma in"></div>
        </a>
        <a id="zoom-out" href="#zoom-out">
          <div id="ZoomOut" class="NavButton" title="Zooma ut"></div>
        </a>
        <a id="rotate-left" href="#rotate-left">
          <div id="RotateLeft" class="NavButton" title="Vrid vänster"></div>
        </a>
        <a id="rotate-right" href="#rotate-right">
          <div id="RotateRight" class="NavButton" title="Vrid höger"></div>
        </a>
        <a id="Download" title="Download">
          <div id="Download" class="NavButton" @click="downloadImage" title="Ladda ner"></div>
        </a>
      </div>

    </div>

    <!--Metadata display-->
    <div v-if="pageData" class="metadata">
      <h3>{{ pageData.work?.title }}</h3>
      <div class="metadata-item" v-if="pageData && pageData.work?.main_author?.name">
        <p>Författare: <span>{{ pageData.work?.main_author?.name }}</span></p>
      </div>
      <div class="metadata-item" v-if="pageData && pageData.work?.sort_year">
        <p>Utgiven: <span>{{ pageData.work?.sort_year }}</span></p>
      </div>
      <div class="metadata-item" v-if="publisher">
        <p>Förlag: <span>{{ publisher }}</span></p>
      </div>
      <div class="metadata-item" v-if="labelSv">
        <p>Beskrivning: <span class='img-type'>{{ labelSv }}</span><span> på sidan {{ pageData.number
            }}</span></p>
      </div>

      <!--<p>Sida: <span>{{ pageData.number }}</span></p>-->
      <div class="metadata-item">
        <p>Länk:<a target="_blank"
            :href='"https://litteraturbanken.se/f%C3%B6rfattare/" + pageData.work.main_author.lbauthorid + "/titlar/" + pageData.work.modernized_title + "/sida/" + (pageData.number - offset) + "/faksimil"'><span>
              Originalsida hos LB</span></a></p>
      </div>
      <div class="metadata-item">
        <p>Antal nära dubletter i verk: <span>{{ numberSimilar }}</span></p>
      </div>
      <div class="tag-container">
        <p>Taggar: <span v-if="imageTags.size > 0" class="tag-labels"><button @click="tagClicked(tag)"
              v-for="tag in imageTags">{{ tag
              }}</button></span> <span v-else> Inga taggar registrerade</span></p>
      </div>
      <div class="metadata-item">
        <p class="info-available">Liknande bilder i alla verk (beräknade med maskininlärning):
          <!-- <span class='info-text'>Liknande bilder beräknades med maskininlärning</span> -->
        </p>
      </div>
    </div>

    <!--Gallery display-->
    <div class="related-gallery">
      <div v-if="loadingMessage" class="loading-message">{{ loadingMessage }}</div>
      <MasonryWall :items="relatedImages" class="masonry" :columnWidth="150" :gap="5" id="masonrywall">

        <template v-slot:default="{ item, index }">
          <div class="gallery__item_related" @click="navigate(item.id)">
            <div class="item-info">
              <div class="item-info-meta">
                <h5>{{ item.title }}</h5>
                <h6>{{ item.author }}</h6>
              </div>
            </div>
            <img :src="item.image" :alt="`Image ${index + 1}`" class="masonry-image" />
          </div>
        </template>

      </MasonryWall>
    </div>
  </div>

</template>

<script lang="ts">
  interface PageData {
    work: Work;
    number: number;
  }
  import { onMounted, ref } from 'vue';
  import OpenSeadragon from 'openseadragon';
  import { setBusy, setNotBusy } from "../components/Waiter.vue";
  import { useRoute } from 'vue-router';
  import MasonryWall from "@yeger/vue-masonry-wall";
  import type { Work } from '@/types/litteraturlabbet';
  import { pagefix } from "@/assets/pagefix.json";
  import Masonry from 'masonry-layout';
  import { watch } from 'vue';

  export default {
    components: {
      MasonryWall,
    },
    props: {
      imageId: String
    },
    setup(props, context) {
      const route = useRoute();
      const viewer = ref();
      const pageData = ref < PageData > ();
      const iiifFile = ref(null);
      const completeUrl = ref(null);
      const labelSv = ref(null);
      const imageTags = ref([]);
      const numberSimilar = ref(null);
      const pageId = ref(null);
      const imageUrls = ref([]);
      const publisher = ref("");
      const offset = 0;
      const relatedImages = ref([]);
      const loadingMessage = ref("");
      const currentImageId = ref(props.imageId);

      const downloadImage = () => {
        const imageUrl = completeUrl.value;
        const author = pageData.value.work?.main_author?.name
        const work = pageData.value.work?.short_title || pageData.value.work?.title
        const workCorrect = work.replaceAll(',', '-').replaceAll('.', '-')
        const pubYear = pageData.value.work?.sort_year
        const pageNum = pageData.value.number
        const downloadName = `${author}_${workCorrect}_${pubYear}_${pageNum}.jpg`
        if (!imageUrl) {
          console.error("No image URL provided for download.");
          return;
        }

        fetch(imageUrl)
          .then(response => response.blob())
          .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = downloadName || "littlab_image.jpg";
            // link.setAttribute('download', downloadName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          })
          .catch(error => {
            console.error("Failed to download image:", error);
          });
      };

      const fetchNeighboursData = async () => {
        loadingMessage.value = "Hämtar relaterade bilder...";
        const baseUrl = 'https://diana.dh.gu.se/api/litteraturlabbet/nearest_neighbours/';
        const response = await fetch(`${baseUrl}?image_id=${props.imageId}&depth=2`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.results.length > 0 && data.results[0].neighbours.length > 0) {
          const neighbours = data.results[0].neighbours;

          imageUrls.value = neighbours.filter((neighbour: any) => neighbour.image.display === true).map((neighbour: any) => neighbour.image.file);
          relatedImages.value = neighbours.filter((neighbour: any) => neighbour.image.display === true).map((neighbour: any) => {
            return {
              title: neighbour.image.page.work.short_title ?? neighbour.image.page.work.title,
              author: neighbour.image.page.work.main_author.name,
              image: neighbour.image.file,
              id: neighbour.image.id,
            }
          });


          loadingMessage.value = "";
          setTimeout(() => {
            const masonry = document.getElementById('masonrywall');

            if (masonry) {
              const masonryWall = new Masonry(masonry, {
                itemSelector: '.gallery__item_related',
                columnWidth: 150,
                gutter: 5,
                fitWidth: false,
              });
              if (masonryWall) {
                if (masonryWall.destroy) {
                  console.log('Destroying masonry wall');
                  masonryWall.destroy();
                }
                // calling .layout() does not work
              }
            }
          }, 100);
        } else {
          imageUrls.value = [];
          loadingMessage.value = "Inga relaterade bilder hittades";
          console.log('No neighbors data found');
        }
      };

      const unshowSelf = () => {
        console.log("Unshowing");
        // emit event to parent
        context.emit('unshow');
      }

      const navigate = (id: string) => {
        console.log("Navigating to", id);
        context.emit('navigate', id);
      }

      const tagClicked = (tag: string) => {
        console.log("New tag search:", tag);
        context.emit('tagClicked', tag);
        unshowSelf()
      }

      const clean = (str: string) => {
        // replace &nbsp; with space
        str = str.replace(/&nbsp;/g, ' ');
        // replace &amp; with &
        str = str.replace(/&amp;/g, '&');
        // replace other html entities
        str = str.replace(/&#(\d+);/g, function (_match, dec) {
          return String.fromCharCode(dec);
        });
        // remove html tags
        return str.replace(/<\/?[^>]+(>|$)/g, "");
      }

      watch(() => props.imageId, async (newVal, oldVal) => {
        setBusy();
        if (newVal !== oldVal) {
          console.log("Image ID changed, fetching new data");
          fetchNeighboursData();
          relatedImages.value = [];
          currentImageId.value = newVal;

          const response = await fetch(`https://diana.dh.gu.se/api/litteraturlabbet/graphic/?id=${newVal}&depth=4`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const graphicData = await response.json();
          iiifFile.value = graphicData.results[0].iiif_file;
          pageId.value = graphicData.results[0].page.id;
          labelSv.value = graphicData.results[0].label_sv.replace('provenance', 'Exlibris');
          completeUrl.value = graphicData.results[0].file;
          viewer.value.open(iiifFile.value + '/info.json');
          numberSimilar.value = graphicData.results[0].similar_count;
          imageTags.value = new Set(graphicData.results[0].tags.map((tag: any) => tag.category.cat_sv));


          //fetch metadata
          if (pageId) {
            const pageResponse = await fetch(`https://diana.dh.gu.se/api/litteraturlabbet/page/?id=${pageId.value}&depth=4`);
            if (!pageResponse.ok) {
              throw new Error(`HTTP error! Status: ${pageResponse.status}`);
            }
            const pageDataResponse = await pageResponse.json();
            pageData.value = pageDataResponse.results[0];
            let extraDataResult;
            if (pageData) {
              extraDataResult = await fetch(`https://litteraturbanken.se/api/get_work_info?lbworkid=${pageData!.value!.work.lbworkid}`);
              const extraData = await extraDataResult.json();
              const p = extraData.data[0].publisher.join(", ");
              publisher.value = clean(p);
            }
            // page fix
            const pfks = Object.keys(pagefix);
            let offset = 0;
            const wid = pageData.value!.work.id + "";
            if (pfks.indexOf(wid) > -1) {
              offset = pagefix[wid as keyof typeof pagefix];
            }
          }

          setNotBusy();
        }

      });


      const initComponent = async () => {
        const response = await fetch(`https://diana.dh.gu.se/api/litteraturlabbet/graphic/?id=${currentImageId.value}&depth=4`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const graphicData = await response.json();
        iiifFile.value = graphicData.results[0].iiif_file;
        pageId.value = graphicData.results[0].page.id;
        labelSv.value = graphicData.results[0].label_sv.replace('provenance', 'Exlibris');
        completeUrl.value = graphicData.results[0].file;
        numberSimilar.value = graphicData.results[0].similar_count;
        imageTags.value = new Set(graphicData.results[0].tags.map((tag: any) => tag.category.cat_sv));

        if (!viewer) {
          console.log("No viewer");
          return;
        }
        viewer.value = OpenSeadragon({
          id: 'viewer',
          prefixUrl: '/openseadragon/',
          showNavigationControl: true,
          showReferenceStrip: false,
          immediateRender: false,
          visibilityRatio: 1.0,
          minZoomImageRatio: 1.0,
          homeFillsViewer: false,
          showZoomControl: true,
          showHomeControl: false,
          showFullPageControl: true,
          showNavigator: false,
          navigatorAutoFade: true,
          showRotationControl: true,
          fullPageButton: "full-page",
          zoomInButton: "zoom-in",
          zoomOutButton: "zoom-out",
          rotateLeftButton: "rotate-left",
          rotateRightButton: "rotate-right",
          tileSources: `${iiifFile.value}/info.json`,
        });



        //fetch metadata
        if (pageId) {
          const pageResponse = await fetch(`https://diana.dh.gu.se/api/litteraturlabbet/page/?id=${pageId.value}&depth=4`);
          if (!pageResponse.ok) {
            throw new Error(`HTTP error! Status: ${pageResponse.status}`);
          }
          const pageDataResponse = await pageResponse.json();
          pageData.value = pageDataResponse.results[0];
          let extraDataResult;
          if (pageData) {
            extraDataResult = await fetch(`https://litteraturbanken.se/api/get_work_info?lbworkid=${pageData!.value!.work.lbworkid}`);
            const extraData = await extraDataResult.json();
            const p = extraData.data[0].publisher.join(", ");
            publisher.value = clean(p);
          }
          // page fix
          const pfks = Object.keys(pagefix);
          let offset = 0;
          const wid = pageData.value!.work.id + "";
          if (pfks.indexOf(wid) > -1) {
            offset = pagefix[wid as keyof typeof pagefix];
          }
        }
      }
      onMounted(async () => {

        fetchNeighboursData();
        initComponent();

      });
      setNotBusy();
      return {
        viewer,
        pageData,
        publisher,
        iiifFile,
        unshowSelf,
        imageUrls,
        labelSv,
        numberSimilar,
        imageTags,
        downloadImage,
        completeUrl,
        offset,
        relatedImages,
        loadingMessage,
        navigate,
        initComponent,
        tagClicked,
      };
    },

  };
</script>

<style scoped>
  .gallery {
    padding: 20px;
    z-index: 1000;
    background-color: #f7f7f7 !important;
  }

  .masonry {
    background-color: #f7f7f7 !important;
  }

  .masonry-image {
    width: 100%;
    display: block;
  }

  .loading-message {
    padding: 20px;
    text-align: center;
  }

  .container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  #viewer {
    width: 100%;
    height: 50vh;
    margin-bottom: 0px;
    user-select: none;
    -webkit-user-select: none;
    position: relative;
    z-index: 1000;
    overflow: hidden;
  }

  .metadata {
    z-index: 1000;
    padding: 10px;
    padding-left: 20px;
    background: linear-gradient(rgba(247, 247, 247, 1) 0%, rgba(255, 255, 255, 1) 100%);
    border-top: 0px solid #ccc;
    border-radius: 0px;
    height: auto;
  }

  .related-gallery {
    height: 165px;
    padding-bottom: 0px;
  }

  @media screen and (max-width: 900px) {
    .related-gallery {
      max-height: auto;
      min-height: 38vh;
    }
  }


  .metadata-item {
    float: left;
    margin-right: 30px;
  }


  .metadata h3 {
    font-weight: 500;
    font-size: 1.4em;
    line-height: 1.0;
    margin-bottom: 10px;
  }

  .metadata h4 {
    font-weight: 400;
    font-size: 1.2em;
    line-height: 1.0;
    margin-bottom: 10px;
  }

  .metadata p {
    font-size: 1.2em;
  }

  .metadata p span {
    color: var(--theme-plain-text);
    font-weight: 500;
  }

  .metadata-item p>a>span {
    color: var(--theme-accent-color);
  }

  .metadata-item p>a>span:hover {
    color: var(--theme-accent-color-dark);
  }

  .close-button {
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    background-color: rgba(35, 35, 35, 0.9);
  }

  #navigatorDiv {
    position: absolute;
    width: 80px;
    height: 80px;
    margin-top: 10px;
    margin-right: 10px;

  }

  #ToolbarHorizontal {
    position: absolute;
    display: flex;
    bottom: 10px;
    width: 100%;
    z-index: 1000;
  }

  #CenterNav {
    margin: auto;
  }

  #ToolbarHorizontal span {
    background-color: rgba(35, 35, 35, 0.6);
    color: white;
    text-align: center;
    padding: 5px 10px 5px 10px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    vertical-align: 13px;
    margin-left: 10px;
    margin-right: 10px;
  }

  #ToolbarVertical {
    position: absolute;
    margin-top: 20px;
    width: 40px;
    margin-left: 22px;
    z-index: 1000;

  }

  #FullPage {
    margin-top: 30px;
    background: url(../assets/openseadragon/expand.svg);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(35, 35, 35, 0.9);
    overflow: hidden;
  }

  #Download {
    margin-top: 20px;
    background: url(../assets/openseadragon/downloadbuttonwhite.png);
    background-size: 90%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(35, 35, 35, 0.9);
    overflow: hidden;
    cursor: pointer;
  }

  #Prev {
    background: url(../assets/openseadragon/prev.png);
    background-size: 35px 35px;
    background-color: rgba(35, 35, 35, 0.9);
    background-repeat: no-repeat;
    background-position: center;
    display: inline-block;
    position: relative;
  }

  #Next {
    background: url(../assets/openseadragon/next.png);
    background-size: 35px 35px;
    background-color: rgba(35, 35, 35, 0.9);
    background-repeat: no-repeat;
    background-position: center;
    display: inline-block;
    position: relative;
  }

  #ZoomIn {
    margin-top: 30px;
    background: url(../assets/openseadragon/plus.svg);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(35, 35, 35, 0.9);


    overflow: hidden;
  }

  #ZoomOut {
    background: url(../assets/openseadragon/minus.svg);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(35, 35, 35, 0.9);
    overflow: hidden;
  }

  #RotateLeft {
    background: url(../assets/openseadragon/rotateleft.svg);
    background-size: 35%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(35, 35, 35, 0.9);
    border-radius: 50%;
    width: 35px;
    height: 35px;
    cursor: pointer;
    overflow: hidden;
    margin-top: 10px;
  }

  #RotateRight {
    background: url(../assets/openseadragon/rotateright.svg);
    background-size: 35%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(35, 35, 35, 0.9);
    border-radius: 50%;
    width: 35px;
    height: 35px;
    cursor: pointer;
    overflow: hidden;
  }

  .NavButton {
    border-radius: 50%;
    width: 35px;
    height: 35px;
    color: white;
    opacity: 0.8;
    margin-bottom: 3px;
    outline: none;
  }

  .NavButton:hover {
    opacity: 1;
  }

  *:focus {
    outline: none !important;
  }

  .gallery__item_related {
    margin-bottom: 10px;
    float: left;
    /* overflow:hidden!important; */
    -webkit-transition-property: none !important;
    -moz-transition-property: none !important;
    -o-transition-property: none !important;
    transition-property: none !important;
  }


  .gallery__item_related:hover .item-info {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0px, rgba(0, 0, 0, 0)100%) !important;
  }

  .gallery__item_related:hover .item-info-meta {
    display: block;
  }

  .img-type {
    text-transform: capitalize
  }

  .tag-container {
    display: flex;
    justify-content: start;
    align-items: center;
    width: 100%;
    z-index: 1000;
    /* margin-bottom: 10px; */
  }


  .tag-labels button {
    margin: 5px;
    padding: 2px 10px 4px 10px;
    border-radius: 4px;
    font-family: "Barlow Condensed", sans-serif !important;
    font-size: 1.0em;
    border: none;
    user-select: none;
    -webkit-user-select: none;
    background-color: var(--theme-accent-color);
    color: white;
    cursor: pointer;
  }

  .tag-labels button::first-letter {
    text-transform: uppercase;
  }

  .tag-labels button:hover {
    background-color: var(--theme-accent-color-dark);
    color: white;
  }

  .info-available {
    /*   border-bottom: 2px dotted var(--theme-plain-text);
  cursor: pointer; */
    font-weight: 400;
  }

  .info-available .info-text {
    visibility: hidden;
    width: 200%;
    background-color: var(--vt-c-white-soft);
    color: var(--theme-plain-text);
    text-align: center;
    padding: 8px 0;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    font-weight: 400;
    margin-top: -7px;
    margin-left: 10px;
  }

  .info-available:hover .info-text {
    visibility: visible;
  }
</style>