<script lang="ts">
import MasonryWall from "@yeger/vue-masonry-wall";
import { watch, onMounted, ref } from 'vue'
import { useRouter } from "vue-router";
import { setNotBusy } from '@/components/Waiter.vue';
import { max } from "lodash";
import Plotly, { Root } from 'plotly.js-dist'


export default {
  components: {
    MasonryWall,
  },
  name: 'images',
  emits: ['toggle-gallery'],
  setup() {
    const umapData = ref([{
      x: [/*x coordinates*/],
      y: [/*y coordinates*/],
      type: 'scatter',
      mode: 'markers'
    }]);

    onMounted(() => {
      const layout = {
        // title: 'UMAP Plot',
        xaxis: {
          showgrid: false,
          zeroline: false,
          visible: false
        },
        yaxis: {
          showgrid: false,
          zeroline: false,
          visible: false
        },
      };
      Plotly.newPlot('umap-plot', umapData.value, layout);
    }
    );
  },
  data() {
    return {
      activeViewer: 'Gallery',
      galleryLabels: ["Alla", "Illustrationer", "Ornament", "Anfanger", "Musiknoter", "Omslagsbilder"],
      filteredData: [],
      data: {},
      query: '',
      imageGroups: [],
      specificOrder: [
        { type: "Anfanger", order: 1 },
        { type: "Illustrationer", order: 2 },
        { type: "Omslagsbilder", order: 3 },
        { type: "Ornament", order: 4 },
        { type: "Musiknoter", order: 5 },
      ]
    }
  },
  methods: {
    toggleViewer(panelName: string) {
      if (this.activeViewer !== panelName) {
        this.activeViewer = panelName;
        this.$emit('toggle-gallery');
      }
    },
    async fetchData(query) {
      let fixQuery = ''
      if (query === 'Alla') { fixQuery = '' }
      else (fixQuery = query)
      console.log(query)
      const response = await fetch(`https://diana.dh.gu.se/api/litteraturlabbet/graphic/?id=&uuid=&label_en=&label_sv=${fixQuery}&score=&depth=3&limit=50`);
      const data = await response.json()
      console.log(data)

      let typeMap = this.specificOrder.map((order) => ({
        ...order,
        items: [],
      }));
      for (let image of data.results) {
        let type = image.type;
        let img_file = image.file
        let extract_id = img_file.split('/')[12]
        console.log(extract_id)
        let item = {
          id: image.id ?? null,
          page_id: image?.page?.id ?? null,
          page_num: image?.page?.number ?? null,
          work_id: image?.page?.work?.id ?? null,
          lb_id: image?.page?.work?.lbworkid ?? null,
          lb_title: image?.page?.work?.modernized_title ?? null,
          title: image?.page?.work?.title ?? null,
          year: image?.page?.work?.sort_year ?? null,
          author: image?.page?.work?.main_author?.name ?? null,
          author_id: image?.page?.work?.main_author?.lbauthorid ?? null,
          type: image?.label_sv ?? null,
          label: image?.label_sv ?? null,
          iiif_file: image.iiif_file ?? null,
          img_file: image.file ?? null,
          correct_file: 'https://data.dh.gu.se/diana/static/litteraturlabbet/original/' + extract_id,
          lb_link: 'https://litteraturbanken.se/f%C3%B6rfattare/' + image.page.work.main_author.lbauthorid + '/titlar/' + image.page.work.modernized_title + '/sida/' + image.page.number + '/faksimil'
        };

        let typeIndex = typeMap.findIndex((x) => x.label_sv === type);
        if (typeIndex !== -1) {
          typeMap[typeIndex].items.push(item);
        }

        this.imageGroups = typeMap.filter((group) => group.items.length > 0);
      }
      this.imageGroups = Array.from(typeMap.values());
    },
    imageLoadLog(imageIndex, groupIndex, image) {
      if (!image.loaded) {
        this.imageLoaded(image);
      }
    },
    imageLoaded(event) {
      // used for refreshing the gallery when the images are loaded
      this.loadedImagesCount += 1;
      // Check if all images are loaded
      if (
        this.loadedImagesCount ===
        this.imageGroups.reduce((count, group) => count + group.items.length, 0)
      ) {
        this.$nextTick(() => {
          this.layoutKey += 1;
        });
      }
    },
  },
  onImageClicked(iiifFile, id) {
      this.selectedIiifFile = id;
      this.idForMetaData = id;

      this.showImageViewer = true;
      if (this.IiifFileforImageViewer) {
        this.$router.replace({
          name: "IiifFile",
          params: {
            iiifFile: this.IiifFileforImageViewer,
          },
        });
      }
    },
}

</script>

<template>

  <div class="galleryLabel">
    <button class="left-button button" :class="{ 'active': activeViewer === 'Gallery' }"
      @click="toggleViewer('Gallery')">
      Galleri
    </button>
    <button class="right-button button" :class="{ 'active': activeViewer === 'Image Cloud' }"
      @click="toggleViewer('Image Cloud')">
      Bildmoln
    </button>
  </div>


  <div class="image-cloud" v-show="activeViewer === 'Image Cloud'">
    <div id="umap-plot"></div>
  </div>
  <div class="gallery" v-show="activeViewer === 'Gallery'">
    <div class="filter-container">
      <button class="dropdown-filter">Filter</button>
      <div class="dropdown-buttons">
        <button class="button" v-for="(label, index) in galleryLabels" :key="index" @click="fetchData(label)">
          {{ label }}
        </button>
      </div>
    </div>

    <div class="gallery" v-show="activeViewer === 'Gallery'">
      <div v-for="(group, groupIndex) in imageGroups" :key="group.type">
        <h3 v-if="group.items.length > 0">{{ group.text }}</h3>
        <MasonryWall :items="group.items" class="masonry" :columnWidth="150" :gap="5">
          <template v-slot:default="{ item, index }">
            <div class="metadata-container card"
              @click="(item.iiif_file, item.id)">
              <img :src="item.correct_file"
                :alt="`Image ${item.label}, ${item.author}, ${item.lb_id}:${item.page_num}`" />
              <div class="grid-item-info" id="gallery">
                <div class="grid-item-info-meta">
                  <h5>{{ item.lb_id }}</h5>
                  <h6>{{ item.title }}, {{ item.author }}</h6>
                </div>
              </div>
            </div>
          </template>

        </MasonryWall>
      </div>
    </div>
  </div>

</template>

<style>
.filter-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.dropdown-filter {
  display: none;
  justify-content: right;
  font-size: 14px;
  padding: 5px 10px;
  text-align: center;
  color: black;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  height: auto;
  width: auto;
  margin-right: 0px;
  background-color: rgb(230, 230, 230);
}

.dropdown-container {
  position: relative
}

.dropdown-buttons {
  display: auto;
  padding: 0px 0px;
  font-size: 14px;
  text-align: center;
  color: black;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  height: min-content;
  width: auto;
  margin-right: 0px;

}


.filter-container:hover .dropdown-buttons {
  display: flex;
  height: auto;
}

.hover-overlay {
  height: 100%;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 100%);
  color: white;
  position: absolute;
  opacity: 0;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  padding: 0px;

}

.galleryLabel {
  display: flex;
  justify-content: center;
  margin: 10px 30px 10px 30px;
}


.gallery {
  margin: 5px;
}

.metadata-container img {
  width: 100%;
  height: auto;
}


.h5 {
  color: black
}

.h6 {
  color: darkgray
}

.button {
  padding: 5px 12px;
  font-size: 14px;
  text-align: center;
  color: black;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  height: auto;
  width: auto;
  margin: 5px;
  background-color: rgb(230, 230, 230);
}

.button:hover {
  background-color: var(--theme-accent-color);
  color: white;
}

.button:focus {
  background-color: var(--theme-accent-color);
  color: white;
}

.galleryLabel .left-button {
  display: flex;
  justify-content: center;
  font-size: 1.1em;
  padding: 5px 20px;
  margin: 10px 0px 10px 0px;
  border-radius: 6px 0px 0px 6px;
}

.galleryLabel .right-button {
  display: flex;
  justify-content: center;
  font-size: 1.1em;
  padding: 5px 20px;
  margin: 10px 0px 10px 0px;
  border-radius: 0px 6px 6px 0px;
}

.image-cloud {
  color: black;
  justify-content: center;
  display: flex;
}

.galleryLabel .active {
  background-color: var(--theme-accent-color);
  color: white;
}

.gallery-container {
  padding-top: 0px;
  margin-top: -5px;
  padding-bottom: 35px;
  /* padding-left:150px; */
}

@media (max-width: 1024px) {
  .gallery-container {
    padding-top: 0px;
    padding-bottom: 35px;
  }
}
.card {
  background-color: transparent;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0rem 0rem 1rem rgba(0, 0, 0, 0.2) !important;
}

.card img {
  transition: all 0.2s ease-in-out;
  transform: scale(1.02);
}

.card:hover img {
  filter: brightness(90%);
  cursor: pointer;
  transform: scale(1.05);
}

.grid-image {
}

.grid-item-info {
  height: 100%;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 100%);
  color: white;
  position: absolute;
  opacity: 0;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  padding: 0px;
}

.grid-item-info:hover {
  opacity: 0.9;
  cursor: pointer;
}

.grid-item-info-meta {
  bottom: 0px;
  position: absolute;
  padding: 10px 10px;
}
</style>