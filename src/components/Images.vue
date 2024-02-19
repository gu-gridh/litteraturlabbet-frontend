<script lang="ts">
import MasonryWall from "@yeger/vue-masonry-wall";
import { watch, onMounted, ref } from 'vue'
import { useRouter } from "vue-router";
import { setNotBusy } from '@/components/Waiter.vue';
import  predsData from "@/assets/preds_clean.json";
import  neighbours from "@/assets/nearest_neighbours.json";
import  duplicates from "@/assets/similar_extractions.json";
import { max } from "lodash";
import Plotly, { Root } from 'plotly.js-dist'


export default {
  components: {
    MasonryWall,
  },
    name:'images',
    emits:['toggle-gallery'],
    data(){
        return{
        activeViewer: 'Gallery',
        galleryLabels: ["Alla", "Illustrationer", "Ornament", "Anfanger", "Musiknoter", "Omslagsbilder"],
        results: predsData.preds,
        filteredData: [],
    }},
    methods:{
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
        <button class="button" :class="{ 'active': activeViewer === 'Galllery' }" @click="toggleViewer('Gallery')">
          Gallery
        </button>
      <button class="button" :class="{ 'active': activeViewer === 'Image Cloud' }" @click="toggleViewer('Image Cloud')">
          Image Cloud
        </button></div>
        

  <div class="image-cloud" v-show="activeViewer === 'Image Cloud'">
    <div id="umap-plot"></div>
  </div>
  <div class="gallery" v-show="activeViewer === 'Gallery'">
    <div class="filter-container">
    <button class="dropdown-filter">Filter</button>
    <div class="dropdown-buttons">
      <button class="button"
        v-for="(label, index) in galleryLabels"
        :key="index"
      >
        {{ label }}
      </button>
    </div></div>

    <div class="grid">
      <div class="metadata-container" v-for="item in results">
            <img
              :src="item.img_url"
              :alt="`Image ${item.extraction_image}`"
              :width="`${item.display_width}`"
              :height="`${item.display_height}`"
            />
            <div class="hover-overlay">
                <h5>{{ item.lb_id }}</h5>
                <h6>{{ item.label_sv }}</h6>
              </div>
            </div>
          </div>
  </div>
</template>

<style>
.filter-container{
  display:flex;
  justify-content: right;}

.dropdown-filter{
  display: flex;
  justify-content: right;
  font-size: 14px;
  padding:5px 10px;
  text-align:center;
  color:black;
  border-radius:6px;
  border: none;
  cursor:pointer;
  height:auto;
  width:auto;
  margin-right: 25px;
  background-color:rgb(230,230,230);
}
.dropdown-container{position:relative}
.dropdown-buttons{
  display: none;
  padding:5px 10px;
  font-size:14px;
  text-align:center;
  color:black;
  border-radius:6px;
  border: none;
  cursor:pointer;
  height:min-content;
  width:auto;
  margin-right:25px;
  background-color:rgb(230,230,230);}


.filter-container:hover .dropdown-buttons{display:flex; height:auto;}
.hover-overlay {  height: 100%;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.7) 100%);
  color: white;
  position: absolute;
  opacity: 0;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
  padding: 0px;}

.galleryLabel {
  display: flex;
  justify-content: center;
  margin: 10px 30px 10px 30px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin: 30px 30px 30px 35px;
}

.grid img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: all 0.2s ease-in-out;
}

.grid img:hover{
  transform:scale(1.03);
opacity:0.4}


.h5{color: black}

.h6{color: darkgray}

.button {
  padding:5px 10px;
  font-size:14px;
  text-align:center;
  color:black;
  border-radius:6px;
  border: none;
  cursor:pointer;
  height:auto;
  width:auto;
  margin:5px;
  background-color:rgb(230,230,230);
}

.button:hover{
  background-color:var(--theme-accent-color);
  color:white;
}
.button:focus{
  background-color:var(--theme-accent-color);
  color:white;
}

.image-cloud{
  color:black;
  justify-content: center;
  display: flex;
}



</style>