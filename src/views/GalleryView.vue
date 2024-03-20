<script setup lang="ts">
import { watch, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from "vue-router";
import { setNotBusy } from '@/components/Waiter.vue'
import ImageDisplays from '@/components/InfiniteImages.vue'

var showGallery = true;
// const viewImage = (index: number) => {
//   router.push({ name: "image-viewer", params: { id: index + 1 } }) // index + 1 to match the image filename
// }
function toggleGallery() {
      showGallery = !showGallery;}

onMounted(() => {
  setNotBusy();
})


</script>

<template>
    <div class="module-title">
      <h1 style="top:30px;  font-size:2.0em!important; font-weight:100!important; z-index:1000;">Grafiska element</h1>
    </div>
    <div class="module-content">
      I litteraturen finner vi grafiska element i form av figurer, ornament, anfanger och musiknoter. 
      Med detta verktyg kan vi extrahera dessa element antingen från författare och enskilda verk, eller från all litteratur under ett eller flera årtionden.
      Detta ger oss en grafisk ingång till litteraturen, och ett redskap att synliggöra förändring med. De grafiska elementen är sorterade kronologiskt.
    </div>
    
    <div class="gallery-area">

  <ImageDisplays
  ref="imageComponent"
        @toggle-gallery="toggleGallery">
</ImageDisplays>

</div>
</template>

<style scoped>

.gallery-area{
  min-height:calc(68vh);
}
.galleryLabel {
  display: flex;
  justify-content: left;
  margin: 10px 30px 10px 30px;
}

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
.button:active{
  background-color:var(--theme-accent-color);
  color:white;
}
/* .grid {
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
} */
</style>
