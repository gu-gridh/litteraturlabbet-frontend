<template>
  <div class="about-container">
    <div class="about">
      <div class="module-title">
        <h1>Om verktygen</h1>
      </div>
      <div class="module-content" style="margin-top:-20px;"> 
        <div style="font-size:1.3em">
        Här kan du analysera verken från Litteraturbankens 1800-talsmaterial med olika verktyg.
        I dagsläget erbjuder vi verktygen <i>Textåterbruk</i>, för att hitta liknande textstycken,
        samt <i>Grafiska element</i> för att undersöka verkens visuella uttryck. Under projektets gång kommer
        Litteraturlaboratoriet att utvecklas med fler verktyg.
      </div>
        <div class="about-content" style="font-size:1.05em">
        Med verktyget <i><b>Textåterbruk</b></i> kan du undersöka nätverket av textåterbruk i delar
      av Litteraturbankens material. Textåterbruk, på engelska <i>textual reuse</i>, är ett fenomen där
      textstycken återkommer i flera olika skrivna verk. 
      <br><br>
      Med verktyget <i>Grafiska element</i> kan du extrahera bildelement antingen från författare och enskilda verk, eller från all litteratur under ett eller flera årtionden.
      Detta ger dig en grafisk ingång till litteraturen, och ett redskap att synliggöra förändring med. 
      
        <br> <br>
        Verktygen utvecklas av <a href="https://dh.gu.se">Göteborgs Forskningsinfrastruktur för Digital Humaniora
          (GRIDH)</a> i samarbete med <a href="https://www.litteraturbanken.se">Litteraturbanken</a>.
        Jonathan Westin och Siska Humlesjö har varit projektledare. Primära utvecklare har varit Victor Wåhlstrand Skärström, Aram Karimi, David Alfter, Ashely Green, Jonathan Westin, Kristin Åkerlund och Tristan
        Bridge. Första versionen publicerades i oktober 2023. Kodbasen finns att hämta på <a
          href="https://github.com/gu-gridh/litteraturlabbet-frontend">GitHub</a>.
        <br> <br>
        Verktyget <i>Textåterbruk</i> använder sig av <i><a href="https://github.com/dasmiq/passim">Passim</a></i>,
        utvecklat av David Smith, för att upptäcka liknande fraser.
      </div>
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
a:link {
  font-weight: 500;
}



a:hover {
  color: rgb(100, 100, 100) !important;
  background-color: white !important;
  cursor: pointer !important;
}

.about-container {
  padding: 50px 50px;
  min-height:auto!important;
  overflow:visible;
}

.about{
margin-top:70px;

}



.about-content {
  padding-top: 30px;
  columns: 2;
  column-gap: 40px;
}

@media screen and (max-width: 1350px) {
  .about-content {
    columns: 1;
  }
  .about-title {
    font-weight: 600 !important;
    font-size: 35px !important;
  }
  .about-container {
    padding: 40px 20px;
  }
}

@media screen and (max-width: 950px) {
  .about-content {
    text-align: left !important;
    font-size: 22px !important;
  }
  .about-container {
  padding: 40px 20px;
  min-height:1000px!important;
  overflow:visible;
}


.about{
margin-top:0px;
}

}
</style>
