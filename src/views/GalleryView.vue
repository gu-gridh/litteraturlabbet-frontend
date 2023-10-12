<script setup lang="ts">
import { onMounted, ref } from 'vue'
import img1 from '@/assets/gallery/1.jpeg'
import img2 from '@/assets/gallery/2.jpeg'
import img3 from '@/assets/gallery/3.jpeg'
import img4 from '@/assets/gallery/4.jpeg'
import img5 from '@/assets/gallery/5.jpeg'
import img6 from '@/assets/gallery/6.jpeg'
import { useRouter } from "vue-router";
import { setNotBusy } from '@/components/Waiter.vue'

const images = ref([img1, img2, img3, img4, img5, img6])
const galleryLabels = ref(["Alla", "Figurer", "Ornament", "Anfanger", "Musiknoter"])

const router = useRouter() 

const viewImage = (index: number) => {
  router.push({ name: "image-viewer", params: { id: index + 1 } }) // index + 1 to match the image filename
}

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
  <div class="galleryLabel">
    <div class="galleryLabelButtons">
      <button class="button"
        v-for="(label, index) in galleryLabels"
        :key="index"
      >
        {{ label }}
      </button>
    </div>
  </div>
  <div class="grid">
    <img
      v-for="(image, index) in images"
      :key="index"
      :src="image"
      @click="viewImage(index)"
    />
  </div>
</template>

<style scoped>
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
  width:95px;
  margin:5px;
  background-color:rgb(230,230,230);
}
.button:hover{
  background-color:rgb(180,100,100);
  color:white;
}
.button:active{
  background-color:rgb(180,100,100);
  color:white;
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
}
</style>
