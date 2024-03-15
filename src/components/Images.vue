<script lang="ts">
import MasonryWall from "@yeger/vue-masonry-wall";
import { watch, onMounted, ref } from 'vue'
import { useRouter } from "vue-router";
import { setNotBusy } from '@/components/Waiter.vue';
import predsData from "@/assets/preds_clean.json";
import neighbours from "@/assets/nearest_neighbours.json";
import duplicates from "@/assets/similar_extractions.json";
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
        }
      };
      Plotly.newPlot('umap-plot', umapData.value, layout);
    });
  },
  data() {
    return {
      activeViewer: 'Gallery',
      galleryLabels: ["Alla", "Illustrationer", "Ornament", "Anfanger", "Musiknoter", "Omslagsbilder"],
      results: predsData.preds,
      filteredData: [],
    }
  },
  methods: {
    toggleViewer(panelName: string) {
      if (this.activeViewer !== panelName) {
        this.activeViewer = panelName;
        this.$emit('toggle-gallery');
      }
    },
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
        <button class="button" v-for="(label, index) in galleryLabels" :key="index">
          {{ label }}
        </button>
      </div>
    </div>

    <div class="gallery" v-show="activeViewer === 'Gallery'">
      <MasonryWall :key="componentKey" :items="results" class="masonry" :columnWidth="150" :gap="5">
        <template v-slot:default="{ item }">
          <div class="metadata-container">
            <img :src="item.img_url" :alt="`Image ${item.extraction_image}`" />
            <div class="hover-overlay">
              <h5>{{ item.lb_id }}</h5>
              <h6>{{ item.label_sv }}</h6>
            </div>
          </div>
        </template>
      </MasonryWall>
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
</style>