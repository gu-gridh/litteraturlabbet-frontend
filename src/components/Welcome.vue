<template>
    <div class="home">
      <div class="pre-title">
      <h1>Välkommen till</h1>
         </div>
       <div class="home-title">
      <h1>Litteratur<br>laboratoriet</h1>
         </div>
         <div class="home-content">



<div class="" style="font-family: 'Cormorant Garamond', serif; font-size:1.5em; margin-top:0px; margin-bottom:10px; pointer-events:none;">Analytiska verktyg: </div>
<router-link to="/reuse/"  class="tool">Textåterbruk</router-link>
<router-link to="/gallery/"  class="tool">Grafiska Element</router-link>

<div style="margin-top:80px; pointer-events:none;">
<p>Totalt <p class="work-emph">{{ workCount }}</p> verk i samlingen.</p>
</div>
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
  background-color: var(--theme-accent-color);
  color: white;
  padding: 0.2rem 0.5rem 0.3rem 0.5rem;
  border-radius: 8px;
  font-weight:500;
  display:inline;
  pointer-events:none;
}

.tool{
  font-family: 'Cormorant Garamond', serif;
  display:block;
  margin:0px;
  padding:5px 12px;
  font-size:2.0em;
  line-height:1.0;
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

  .pre-title h1{
    font-family: 'Cormorant Garamond', serif;
    letter-spacing: -2px;
    margin-top:30px;
    margin-bottom:0px;
    font-size:35px !important;
    line-height:0.9;
    text-align:center;
    color:black;
    pointer-events:none;
  }
  .home-title h1{
    font-family: 'Cormorant Garamond', serif;
    letter-spacing: -3px;
    margin-top:-28px;
    margin-bottom:30px;
    font-size:70px !important;
    font-weight:100px !important;
    line-height:0.85;
    text-align:center;
    color:black;
    pointer-events:none;
  }

  @media screen and (max-width: 1350px) {
  .home-title h1{
    font-size:55px !important;
   
  }
}

    .home-content{
      color:black;
     font-size:18px!important;
     padding:10px 30px;
          text-align:center;
         line-height:1.15;
    
  }


 @media screen and (max-width: 950px) {
  .pre-title h1{

    font-size:45px !important;
   }
   .home-title h1{
   font-weight:300 !important;
    font-size:90px !important;
   }

    .home-content{
 text-align:center !important;
     font-size:22px !important;
    
  }
 }
 
  </style>
  