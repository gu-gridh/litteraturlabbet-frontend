<template>
    <div class="home">
       <div class="home-title">
      <h1>Välkommen till<br>Litteraturlaboratoriet</h1>
         </div>
         <div class="home-content">
 Här kan du analysera verken från Litteraturbanken med olika verktyg. 
 I dagsläget erbjuder vi verktyget <b>Textåterbruk</b>, för att hitta liknande textstycken. 
 Under projektets gång kommer Litteraturlaboratoriet att utvecklas med fler verktyg, 
 samt optimeringar av datan från Litteraturbanken.
         </div>
    </div>
  </template>
  <script setup lang="ts">
import { setNotBusy } from '@/components/Waiter.vue';
import { onMounted } from 'vue';

  onMounted(() => {
    setNotBusy();
  });
</script>
  <style>

  .home {
    width:100%;
padding:50px;
 font-weight:600 !important;
   font-family: "Barlow Condensed", sans-serif;
     
  }

  .home-title{
       font-family: 'Cormorant Garamond', serif;
       letter-spacing: -3px;
    margin-top:30px;
    font-size:30px;
    line-height:0.9;
       text-align:center;
      color:black;
   

  }

    .home-content{
      color:black;
     font-size:20px!important;
     padding:30px;
          text-align:justify;
         line-height:1.15;
    
  }


 @media screen and (max-width: 950px) {
   .home-title{
   font-weight:600 !important;
    margin-top:30px;
    font-size:35px !important;
   }

    .home-content{
 text-align:center !important;
     font-size:22px !important;
    
  }
 }
 
  </style>
  