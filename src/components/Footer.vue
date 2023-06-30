<template>
  <footer id="footer">
    <a href="http://www.litteraturbanken.se/">
      <div id="PartnerLogo">LB</div>
    </a>
    <a href="https://dh.gu.se/">
      <div id="CDHLogo">#GRIDH +</div> 
    </a> 
   
    <!-- <div id="citation"> 
      Citera portalen: Humlesjö, Siska, Åhlfeldt, Johan, Strinnholm, Anders <i>et al.</i> (2023).<br>
      <i>Göteborgs jubileum 1923</i>, v.1.0 GRIDH. https://jubileet1923.dh.gu.se/. Accessed [datum]<br>
      </div> -->

      <div id="legal"> 
      Bilder: <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.sv">CC0 1.0</a><br>
      Texter: <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
</div>
  </footer>
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
  position: absolute;
  z-index: 3000;
  bottom: 0px;
    font-family: "Barlow Condensed", sans-serif;
}

a {
  font-weight: normal;
  color:white!important;
}

a:visited{
  color:white!important;
}

#CDHLogo {
  color:white;
  float: right;
  margin-top: 0px;
  margin-right:10px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 57px;
  line-height: 0.4;
  padding: 25px 0px 10px 0px;
  vertical-align: middle;
}

#PartnerLogo {
  color:white;
  float: right;
  margin-top: 0px;
  margin-right: 50px;
  width: auto;
  height: auto;
  text-align: left;
  font-weight: 100;
  font-style: normal;
  font-size: 57px;
  line-height: 0.4;
  padding: 25px 0px 10px 0px;
  vertical-align: middle;
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
</style>
