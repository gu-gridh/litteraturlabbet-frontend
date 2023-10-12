<template>
<div class="about-container">
  <div class="about">
   <div class="module-title">
      <h1>Om laboratoriet</h1>
         </div>
         <div class="module-content">
            Här kan du analysera verken från Litteraturbankens 1800-talsmaterial med olika verktyg. 
 I dagsläget erbjuder vi verktygen <i>Textåterbruk</i>, för att hitta liknande textstycken, 
 samt <i>Grafiska element</i> för att undersöka verkens visuella uttryck. Under projektets gång kommer Litteraturlaboratoriet att utvecklas med fler verktyg, 
 samt optimeringar av datan från Litteraturbanken.
 <br> <br>
 Verktygen utvecklas av <a href="https://dh.gu.se">Göteborgs Forskningsinfrastruktur för Digital Humaniora (GRIDH)</a> i samarbete med <a href="https://www.litteraturbanken.se">Litteraturbanken</a>. 
 Primära utvecklare har varit Victor Wåhlstrand Skärström, Aram Karimi, David Alfter, Kristin Åkerlund, Tristan Bridge, Ashely Green, Siska Humlesjö och Jonathan Westin. 
 Första versionen publicerades i augusti 2023. Kodbasen finns att hämta på GitHub: <a href="https://github.com/gu-gridh/">https://github.com/gu-gridh/</a>
 <br> <br>
 Verktyget <i>Textåterbruk</i> använder sig av <i><a href="https://github.com/dasmiq/passim">Passim</a></i>, utvecklat av David Smith, för att upptäcka liknande fraser.

         </div>
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
<style scoped>

a:link{
font-weight:500;
}

a:visited{

}

a:hover{
color:rgb(100, 100, 100) !important;
background-color:white !important;
cursor:pointer !important;
}

       .about-container{
    display:flex;
      align-items: center;
        flex-direction: row;
         padding:0px;
  }

       .about{
   padding:50px;
    width:100%;
        
  }

  
.about-title{
       font-family: 'Cormorant Garamond', serif;
       letter-spacing: -3px;
    margin-top:10px;
    font-size:25px;
    line-height:0.9;
       text-align:left;
      width:100%;
  }

    .about-content{
color:black!important;
     font-size:18px;
padding:30px 30px 10px 10px;
          text-align:justify;
         line-height:1.15;
               width:100%;
  }

   @media screen and (max-width: 950px) {
   .about-title{
   font-weight:600 !important;
    margin-top:20px;
    font-size:35px !important;
   }

    .about-content{
 text-align:center !important;
     font-size:22px !important;
    
  }
 }





</style>
