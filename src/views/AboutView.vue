<template>
<div class="about-container">
  <div class="about">
   <div class="about-title">
      <h1>Om verktyget</h1>
         </div>
         <div class="about-content">
 Verktyget utvecklas av Centrum för Digital Humaniora i samarbete med Litteraturbanken. 
 Primära utvecklare har varit Victor Wåhlstrand Skärström (textåterbruk), Aram Karimi (ordvektorer) och Jonathan Westin (användargränssnitt). 
 Första versionen publicerades i december 2022. Kodbasen finns att hämta på GitHub: <a href="https://github.com/CDH-DevTeam">https://github.com/CDH-DevTeam</a>
<br>
<br>
Välj en författare med hjälp av sökfältet till vänster. Vill du undersöka ett visst verk så välj det från den undra menyn. Klicka sedan på sök. Du kan också göra en sökning på samtliga verk i databasen genom att lämna sökfälten fria när du klickar på sök.

         </div>
           </div>
           </div>
</template>

<style scoped>

a:link{
color:rgb(182, 82, 139);
}

a:visited{
color:rgb(182, 82, 139);
}

a:hover{
color:rgb(202, 102, 159) !important;
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
    margin-top:30px;
    font-size:30px;
    line-height:0.9;
       text-align:center;
      color:rgb(182, 82, 139);
      width:100%;
  }

    .about-content{
color:black!important;
     font-size:18px;
padding:30px;
          text-align:justify;
         line-height:1.15;
         
               width:100%;
  }

   @media screen and (max-width: 950px) {
   .about-title{
   font-weight:600 !important;
    margin-top:30px;
    font-size:35px !important;
   }

    .about-content{
 text-align:center !important;
     font-size:22px !important;
    
  }
 }





</style>
