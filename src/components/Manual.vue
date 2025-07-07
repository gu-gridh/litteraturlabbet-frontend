<template>
    <div class="sticky-close" @click="$emit('close-manual')">
        <span class="bold">X</span>
        STÄNG
    </div>
<div class="manual-container">
  <h2>Om Litteraturlaboratoriet</h2>
  <p>
    Litteraturlaboratoriet är en experimentell miljö där du kan utforska delar av 1800-talets svenska litteratur med digitala metoder. 
    De två verktygtygen, <span class="bold"><router-link to="/reuse/">Textåterbruk</router-link></span> och 
    <span class="bold"><router-link to="/gallery/">Grafiska element</router-link></span>, 
    är byggda för att synliggöra litterära och visuella mönster i Litteraturbankens korpus.
  </p>
  <br/>
  <h2>Vad är en korpus?</h2>
  <p>
    En <span class="bold">korpus</span> är en större samling texter som används för språkvetenskaplig eller litteraturvetenskaplig analys. 
    Verktygen använder denna korpus för att identifiera och analysera textåterbruk och grafiska element.
  </p>
  <br/>
  <h2>Textåterbruk</h2>
  <h3>Vad är textåterbruk?</h3>
    <p>
        Textåterbruk innebär att textstycken återkommer i flera olika verk – som exakta kopior eller omformuleringar. 
        Det kan handla om stilgrepp, citat, återanvända formuleringar eller intertextuella nätverk mellan författare.
    </p>
    <br/>
    <h3>Att söka i Textåterbruk</h3>
    <p>
        Du kan utforska återbruk på fyra sätt:
    </p>
    <ol>
        <li>Författare</li>
        <ul>
            <li>Välj en författare i den övre rulllistan</li>
            <li>Endast författare där återbruk har identifierats visas</li>
            <li>En <span class="bold">nätverksgraf</span> generaras automatiskt (se nedan)</li>
        </ul>
        <li>Återbruk mellan två författare</li>
        <ul>
            <li>Efter att ha valt en författare, visas en lista över andra författare som har textåterbruk i relation till den valda</li>
            <li>Välj en andra författare för att se resultat</li>
        </ul>
        <li>Specifika verk</li>
        <ul>
            <li>I rullistan Sök efter verk visas endast verk där återbruk har identifierats</li>
        </ul>
        <li>Frassökning</li>
        <ul>
            <li>Skriv in valfri fras eller enstaka ord i fältet <span class="italic">Sök efter en fras</span></li>
            <li>Längre och mer unika fraser ger mer precisa träffar</li>
        </ul>
    </ol>
    <br/>
    <h3>Resultatvisning</h3>
    <p>
        Resultat visas i en lista:
    </p>
    <ul>
        <li>Till vänster anges <span class="bold">antalet verk</span> där stycket återkommer och <span class="bold">antalet självåterbruk</span> hos författaren</li>
        <li>Klicka på ett stycke för att se <span class="bold">vilka författare och verk</span> det förekommer i. Återbrukade partier markeras i <span class="bold">fet stil</span></li>
        <li>Klicka vidare för att öppna textstycket i Litteraturbanken</li>
    </ul>
    <br/>
    <h3>Nätverksgraf</h3>
    <p>
        Ovanför resultatlistan visas en interaktiv graf:
    </p>
    <ul>
        <li><span class="bold">Orange nod</span>: den valda författaren</li>
        <li><span class="bold">Ljusblå noder</span>: andra författare med återbruk i relation</li>
        <li><span class="bold">Klicka på en nod</span> för att byta fokus till den författaren</li>
        <li><span class="bold">Klicka på en länk</span> mellan noder för att se återbruk mellan dem</li>
    </ul>
    <p>
        Grafen visualiserar hur texter och idéer rörde sig mellan författare i det litterära landskapet under 1800-talet.
    </p>
    <br/>
    <h2>Grafiska element</h2>
    <h3>Vad är Grafiska element?</h3>
    <p>
        <span class="bold">Grafiska element</span> är ett verktyg för att utforska illustrationer och andra visuella komponenter 
        i 1800-talets svenska skönlitteratur. Med hjälp av <span class="bold">maskininlärning</span> har bilder identifierats, kategoriserats och grupperats efter innehåll och visuell likhet.
    </p>
    <br/>
    <h3>Hur fungerar tekniken?</h3>
    <h4>Maskininlärning</h4>
    <p>
        Modellen tränas på tusentals bilder där den får lära sig olika typer av bilder, t.ex. illustrationer, initialer och ornament.  
        En annan taggar innehållet i bilderna, t.ex. djur, kartor, vapen och porträtt.  Båda modellerna kan extrahera data för nya bilder.
    </p>
    <br/>
    <h4>Visuella likheter</h4>
    <p>
        Algoritmen kan även hitta bilder som liknar varandra, men likheten baseras ofta på <span class="bold">form och färg</span> snarare än motiv. 
        En rund illustration av ett ägg kan därför uppfattas som lik en rund vapensköld – detta kräver mänsklig tolkning.
    </p>
    <br/>
    <h3>Att använda Grafiska element</h3>
    <h4>Uforska bildkategorier</h4>
    <p>
        Vid start visas Illustrationer. Du kan även utforska:
    </p>
    <ul>
        <li><span class="bold">Omslagsbilder</span></li>
        <li><span class="bold">Musiknoter</span></li>
        <li><span class="bold">Anfanger</span> (utsmyckade initialer)</li>
        <li><span class="bold">Exlibris</span> (ägarmärken)</li>
        <li><span class="bold">Ornament</span> (grafiska dekorelement i text)</li>
    </ul>
    <br/>
    <h4>Bildvyn</h4>
    <ul>
        <li>Zooma med musen eller +/–-knappar</li>
        <li>Bilderna visas i <span class="bold">IIIF format</span> för högupplöst visning</li>
        <li><span class="bold">Ladda ner</span> bolden i hög kvalitet</li>
    </ul>
    <br/>
    <h4>Metadata och taggar</h4>
    <p>
        Under varje bild visas:
    </p>
    <ul>
        <li>Länk till <span class="bold">boksidan i Litteraturbanken</span></li>
        <li><span class="bold">Automatiskt genererade taggar</span></li>
        <li><span class="bold">Föreslagna liknande bilder</span></li>
    </ul>
    <p>
        Taggarna är även sökbara och kan användas för att filtrera bildflödet. 
        Notera att taggarna inte alltid är korrekta – de är ett stöd för <span class="bold">kategorisering</span>, inte en exakt klassificering.
    </p>
    <br/>
    <h2>Rättigheter och vidare användning</h2>
    <p>
        Alla bilder i Grafiska element är fria från upphovsrätt och publicerade under 
        <span class="bold"><a href="https://creativecommons.org/public-domain/cc0/">Creative Commons CC0</a></span>. Du får:
    </p>
    <ul>
        <li>Använda bilderna fritt</li>
        <li>Redigera och återpublicera dem</li>
        <li>Integrera dem i nya projekt – utan krav på tillstånd eller källhänvisning</li>
    </ul>
    <br/>
    <div class="button" @click="$emit('close-manual')">Stäng manual</div>
    <br/>
    <br/>
  </div>

</template>

<script>
import { RouterLink } from "vue-router";

export default {
  name: "Manual",
  components: {
    RouterLink
  }
};
</script>

<style scoped>
.manual-container {
    position: absolute;
    top: 0;
    left: 0;
    
    width: 100%;
    background-color: var(--color-background-soft);
    z-index: 1000;
    padding-left: 50px;
    padding-top: 20px;
    padding-right: 50px;
    padding-bottom: 70px;
    font-size: 1.2rem;
    overflow-x: hidden;
    overflow-y: auto;
}
h2 {
    font-family: "Cormorant Garamond", serif;
    font-weight: 300;
    color: var(--theme-main-color-dark);
    letter-spacing: -2px;
    padding-bottom: 5px;
}
.bold {
    font-weight: bold;
}
.italic {
    font-style: italic;
}
.reuse-showcase-container ul {
    list-style-type: disc;
    margin-left: 20px;
}
.reuse-showcase-container ol {
    list-style-type: decimal;
    margin-left: 20px;
}
.reuse-showcase-container li {
    margin-bottom: 10px;
}
.reuse-showcase-container p {
    margin-bottom: 15px;
}

.reuse-showcase-container a:hover {
    text-decoration: underline;
}
.reuse-showcase-container h3 {
    font-family: "Cormorant Garamond", serif;
    font-weight: 400;
    color: var(--theme-accent-color-dark);
    margin-top: 20px;
}
.reuse-showcase-container h4 {
    font-family: "Cormorant Garamond", serif;
    font-weight: 400;
    color: var(--theme-accent-color-dark);
    margin-top: 15px;
}
.sticky-close {
    position: fixed;
    top: 10px;
    right: 20px;
    background-color: var(--color-background-soft);
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1001;
}
.button {
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--theme-main-color);
    color: var(--color-background-soft);
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
}
</style>