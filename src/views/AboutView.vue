<template>
<div class="about-container">
  <div class="about">
   <div class="about-title">
      <h1>Om verktygen</h1>
         </div>
         <div class="about-content">
 Verktygen utvecklas av <a href="https://dh.gu.se">Göteborgs Forskningsinfrastruktur för Digital Humaniora (GRIDH)</a> i samarbete med <a href="https://www.litteraturbanken.se">Litteraturbanken</a>. 
 Primära utvecklare har varit Victor Wåhlstrand Skärström, Aram Karimi, David Alfter, Kristin Åkerlund, Tristan Bridge, Ashely Green, Siska Humlesjö och Jonathan Westin. 
 Första versionen publicerades i augusti 2023. Kodbasen finns att hämta på GitHub: <a href="https://github.com/gu-gridh/">https://github.com/gu-gridh/</a>
<br>
<br>
Välj ett verktyg såsom <i>Textåterbruk</i> eller <i>Grafiska element</i>, och välj sedan en författare med hjälp av sökfälten till vänster. Vill du undersöka ett visst verk så välj det från den undra menyn. Klicka sedan på sök.

         </div>
           </div>
           </div>
</template>

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
   
    width:100%;
         padding:50px;
  }

  
.about-title{
       font-family: 'Cormorant Garamond', serif;
       letter-spacing: -3px;
    margin-top:10px;
    font-size:30px;
    line-height:0.9;
       text-align:center;
      width:100%;
  }

    .about-content{
color:black!important;
     font-size:20px;
padding:30px 30px 10px 30px;
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
