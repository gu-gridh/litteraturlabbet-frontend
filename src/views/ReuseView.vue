<template>
  <div v-if="author" class="reuse-container-w-author">
    <div class="chart-container">
      <div>
        <p class="about-reuse">Om textåterbruk</p>
        <p>
          Textåterbruk utgör alla upprepade förekomster av textstycken utanför
          ett visst verk. Detta kan bero på plagiat, citat, utbyten. 
          Återbruk sker inte i en riktning - nätverket visar hur författare <i>delar</i> återbruk, vars 
          ursprung kan vara svårt att bestämma utan närläsning.
        </p>
        <br/>
        <p class="about-reuse">Grupper av liknande stycken</p>
        <p v-if="author">
          Givet en författare eller ett verk kan vi identifiera mycket likartade
          stycken, grupper av återbruk som förekommer i flera verk. I listan
          nedan visas ett exempel ur respektive grupp. Även om styckena är
          mycket likartade, kan det ändå skilja sig i ord och stavning.
          <br />
          <br />
          Klicka på en grupp för att detaljläsa alla exempel!
        </p>
        <p v-else>
          Sök på en författare eller ett verk för att identifiera mycket
          likartade stycken, grupper av återbruk som förekommer i flera verk.
          Även om styckena är mycket likartade, kan det ändå skilja sig i ord
          och stavning.
        </p>
      </div>
      <suspense>
        <network-chart
          :author="author"
          :width="500"
          :height="300"
        ></network-chart>
        <template #fallback> Laddar... </template>
      </suspense>
    </div>

    <suspense>
      <reuse-list v-if="author" :author="author" :work="work"></reuse-list>
    </suspense>
  </div>

  <div v-else class="reuse-container-wo-author">
    <div class="chart-container">
      <suspense>
        <network-chart :width="800" :height="400"></network-chart>
        <template #fallback> Laddar... </template>
      </suspense>
    </div>
    <div class="reuse-title">
      <h1>Textåterbruk</h1>
    </div>
    <div class="reuse-content">
      Textåterbruk, på engelska <i>textual reuse</i>, är ett fenomen där textstycken återkommer i flera olika skrivna verk. 
      Detta kan bero på plagiat, citat, utbyten mellan författare, eller mer vardagliga orsaker. Eventuellt återbruk är inte alltid avsiktligt, utan kan bero på parafraser, 
      vanliga talesätt eller helt enkelt redaktörers ingrepp i författares verk.
      <br/>
      <br/>
      Återbruk är inte nödvändigtivs linjärt, om liknande textstycken förekommer hos flera författare behöver de inte ha lånat materialet från varandra 
      - det kan exempelvis finnas en odokumenterad tredje part varifrån texten ursprungligen kommer. Av denna anledning kan man inte med enkla medel bestämma en källa 
      av återbruket, eller vem som eventuellt plagierat vem.
      <br/>
      <br/>
      I denna applikation kan användare undersöka nätverket av återbruk i delar av Litteraturbankens material. Interagera med nätverket för att utröna vilka författare
      i samlingen som delar textstycken med varandra, en tjockare linje mellan två författare visar på fler utbyten. Sök sedan på en specifik författare för att detaljläsa återbruken.
    </div>
  </div>
</template>

<script setup lang="ts">
import NetworkChart from "@/components/NetworkChart.vue";
import ReuseList from "@/components/ReuseList.vue";

defineProps<{
  author?: number;
  work?: number;
}>();
</script>

<style scoped>
.about-reuse {
  /* width: 200px; */
  color: black;
  font-size: x-large;
}
.chart-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.reuse-container-wo-author {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.reuse-container-w-author {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.reuse-list-label {
  display: flex;
  margin-left: 0rem;
  margin-bottom: 2rem;
  background-color: white;
  color: black;
  padding: 1rem 1.5rem 1rem 1.5rem;
  border-radius: 0px;
  flex-direction: row;
  justify-content: space-between;
}

.reuse-label {
  line-height: 2.5rem;
  max-width: 85%;
  font-size: 17px;
}

.author-name,
.work-title {
  background-color: rgb(182, 82, 139);
  color: white;
  padding: 0.5rem 0.7rem 0.5rem 0.7rem;
  border-radius: 8px;
}

.reuse-title {
  font-family: "Cormorant Garamond", serif;
  letter-spacing: -3px;
  margin-top: 30px;
  font-size: 30px;
  line-height: 0.9;
  text-align: center;
  color: rgb(182, 82, 139);
}

.reuse-content {
  color: black;
  font-size: 18px;
  padding: 30px;
  text-align: justify;
  line-height: 1.15;
}
</style>
