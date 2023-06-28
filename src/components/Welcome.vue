<template>
    <div class="home">
       <div class="home-title">
      <h1>Välkommen</h1>
         </div>
         <div class="home-content">

<p>Totalt <p class="work-emph">{{ workCount }}</p> verk i samlingen.</p>

<div style="margin-top:30px;font-size:1.2em;">Analytiska verktyg </div>
<router-link to="/reuse/"  class="tool">Textåterbruk</router-link>
<router-link to="/gallery"  class="tool">Grafiska Element</router-link>

         </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { list, get } from "@/services/diana";
import { searchStore } from "@/stores/search";
import { useRoute } from 'vue-router'


const store = searchStore();
const workCount = ref<number>();

  // Update the work count
  countWorks();

function countWorks() {
  list<Work>("work/19th_century", {
    main_author: store.author?.id,
  }).then((w) => {
    workCount.value = w.count;
  });
}

onMounted(() => {
  countWorks();
});

</script>
  
  <style scoped>
  p{
    font-size:1.1em;
  }

.work-emph{
  background-color: black;
  color: white;
  padding: 0.2rem 0.5rem 0.3rem 0.5rem;
  border-radius: 8px;
  font-weight:500;
  display:inline;
}

.tool{
  display:block;
  border-radius:8px;
  background-color:rgb(240,240,240);
  margin:10px!important;
  padding:8px 12px;
  font-size:1.3em;
  transition: all 0.2s ease-in-out;
  cursor:pointer;

}

.tool:hover{
  transform:scale(1.05);
}

  .home {
    width:100%;
padding:50px 0px;
 font-weight:600 !important;
   font-family: "Barlow Condensed", sans-serif;
     
  }

  .home-title h1{
       font-family: 'Cormorant Garamond', serif;
       letter-spacing: -3px;
    margin-top:30px;
    margin-bottom:30px;
    font-size:50px !important;
    line-height:0.9;
       text-align:center;
      color:black;
   

  }

    .home-content{
      color:black;
     font-size:18px!important;
     padding:30px;
          text-align:center;
         line-height:1.15;
    
  }


 @media screen and (max-width: 950px) {
   .home-title h1{
   font-weight:600 !important;
    margin-top:30px;
    font-size:50px !important;
   }

    .home-content{
 text-align:center !important;
     font-size:22px !important;
    
  }
 }
 
  </style>
  