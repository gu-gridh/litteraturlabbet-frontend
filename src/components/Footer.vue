<template>

<div id="footer">
    <div id="developer-info">
      <div class="links-stack border-style">
        <a class="site-link link" href="https://github.com/gu-gridh/litteraturlabbet-frontend" target="_blank">
          Kod och utveckling</a>
        <a class="site-link link" href="https://www.lb.se"
          target="_blank">Litteraturbanken</a>
      </div>
      <div class="links-stack">
        <a class="site-link link" href="https://litteraturbanken.se/diktensmuseum/nya-vagar-inledning/" target="_blank">
          Projektet Nya vägar till det förflutna</a>

      
          <a class="download-link" href="" target="_blank">
          Bilder: CC0 1.0 | Texter: CC BY 4.0 </a>

      </div>
    </div>
    <div class="partners">


      <a href="https://dh.gu.se/">
        <div class="link GRIDHLogo" id="">GU / GRIDH</div>
      </a>

      <a href="http://www.litteraturbanken.se">
        <div class="link PartnerLogo" id="">LB</div>
      </a>

      
        <div class="link PartnerLogo" id="">Litteraturlaboratoriet</div>
    

    </div>
  </div>


 

</template>

<script setup lang="ts">
</script>

<style scoped>
#footer {
  background-color: #222;
  color: white;
  line-height: 1;
  height: 80px;
  width: calc(100% + 2px);
  font-size: 12px;
  position: fixed;
  z-index: 3000;
  bottom: 0px;
  font-family: "Barlow Condensed", sans-serif;
}

@media screen and (max-width: 950px) {
#footer {
 display:none;
}
}

a {
  font-weight: normal;
  color:white!important;
}

a:visited{
  color:white!important;
}

#citation {
  float: right;
  margin-right: 20px;
  width: 500px;
  height: auto;
  text-align: right;
  font-weight: 200;
  font-style: normal;
  font-size: 14px;
  line-height: 1.3;
  padding-right:20px;
  margin-top:23px;;
  vertical-align: middle;
  border-style:solid;
  border-width:0 0.5px 0 0px;
  border-color:white;
}

#legal{
  color:white;
  float: left;
  margin-left: 50px;
  width: 200px;
  height: auto;
  text-align: left;
  font-weight: 200;
  font-style: normal;
  font-size: 14px;
  line-height: 1.3;
  margin-top:23px;;
  vertical-align: middle;
}




  a:link {
    font-weight: bold;
    color: white !important;
    text-decoration: none;
  }

  a:visited {
    color: white !important;
  }



  .partners {
    float: right;
    position: fixed;

    bottom: 0px;
    right: 0px;
    height: 80px;
  }

  .GRIDHLogo {
    float: right;
    margin-top: 30px;
    width: auto;
    height: auto;
    text-align: left;
    font-weight: 100;
    font-style: normal;
    font-size: 30px;
    line-height: 0.8;
    padding: 0px 60px 5px 30px;
    vertical-align: middle;
  }

  .PartnerLogo {
    float: right;
    margin-top: 30px;
    width: auto;
    height: auto;
    text-align: left;
    font-weight: 100;
    font-style: normal;
    font-size: 30px;
    line-height: 0.8;
    padding: 0px 30px 5px 30px;
    vertical-align: middle;
    border-width: 0px 0.5px 0px 0px;
    border-color: white;
    border-style: solid;
  }

  #developer-info {
    display: flex;
    align-items: flex-end;
    margin-left: 50px;
    margin-top: 15px;
    font-size: 1.5em;
    line-height: 1.4;
    font-weight: 200;
  }

  .border-style {
    border-width: 0 0.5px 0 0px;
    border-color: white;
    border-style: dashed;
    padding-left: 10px;
    padding-right: 20px;

  }

  .link {
    color: white;
  }

  .link:hover {
    opacity: 0.8;
  }

  .download-link {
    background: url("/downloadbuttonwhite.png");
    background-size: 18px;
    background-position: 0px 50%;
    background-repeat: no-repeat;
    padding-left: 25px;
    margin-left: 0px;
  }

  .site-link {
    background: url("linkbuttonwhite.png");
    background-size: 18px;
    background-position: 0px 50%;
    background-repeat: no-repeat;
    padding-left: 25px;

  }

  .no-link {

    background-size: 18px;
    background-position: 0px 50%;
    background-repeat: no-repeat;
    padding-left: 25px;

  }

  .links-stack {
    margin-right: 20px;
  }

  .links-stack a {
    display: block;
  }

  #developer-info a:link {
    font-weight: 200;
  }
</style>
