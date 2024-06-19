<script setup lang="ts">
import { watch, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from "vue-router";
import { setBusy, setNotBusy } from '@/components/Waiter.vue'
import ImageDisplays from '@/components/InfiniteImages.vue'
import { onBeforeMount } from 'vue';

var showGallery = true;
// const viewImage = (index: number) => {
//   router.push({ name: "image-viewer", params: { id: index + 1 } }) // index + 1 to match the image filename
// }
function toggleGallery() {
      showGallery = !showGallery;}

onMounted(() => {
  //setNotBusy();
  scrollTo({
    top: 220,
    behavior: 'smooth'
  })
})

onBeforeMount(() => {
  setBusy();
})


</script>

<template>

  <div class="gallery-area">

      <ImageDisplays
        ref="imageComponent"
        @toggle-gallery="toggleGallery">
      </ImageDisplays>
      <div class="paddy">  </div>
  </div>

</template>

<style scoped>

.gallery-area{
  margin-top:0px;
  max-height:calc(82vh);
  min-height:calc(82vh);
}

@media screen and (max-width: 900px) {
  .gallery-area{
    max-height:auto;
    min-height:100vh;
}
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
