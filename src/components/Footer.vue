<template>
  <footer id="footer">
    <div id="CDHLogo" style="margin-left:40px;margin-top:0px; width:210px;padding: 20px 0px 30px 0px; border-style:solid; border-width:0px 0px 0px 0px; border-color:white;">Centre<br><span style="font-family: 'Clicker Script', cursive; font-size:30px;  vertical-align:40%;">for </span>Digital <br>Humanities</div>
    
    <div id="SuperContainer">
      
      <div class="container" style="width: 250px; height: 100%">
        
      </div>

      <div class="CitateContainer">
        <div>
         
        </div>

        <div style="padding-top: 0.8rem">
          <div></div>
          <div>
           
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
#footer {
  float: left;
  background-color: #222;
  color: white;
  line-height: 1.3;
  height: 150px;
  width: 100%;
  font-size: 18px;
overflow:hidden;
}
#SuperContainer {
  float: left;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.container {
  float: left;
  margin-left: 50px;
}

 #CDHLogo {
   float:left;
			margin-top:0px;
			left:20px;
            width: auto;
            height: auto;
            text-align: left;
            font-weight: 100;
            font-style: normal;
            font-size: 50px;
            line-height: 0.8;
            padding: 30px 0px 10px 0px;
            vertical-align: middle;
            font-family: 'Barlow Condensed', sans-serif;
  
        }

.CitateContainer {
  float: left;
  max-width: 320px;
  margin-left: 50px;
  border-style: solid;
  border-width: 0 0px 0 0px;
  border-color: white;
  padding: 0.3rem 0px 0px 50px;
}
@media screen and (max-width: 1000px) {
    #CDHLogo {
    display:none;
  }
}

@media screen and (max-width: 800px) {
  .CitateContainer {
    margin-top: 20px;
    border-style: solid;
    border-width: 0 0px 0 0;
    border-color: white;
    padding: 0px 0px 0px 0px;
  }


}

.IntroInfoContainer {
  height: 30px;
  width: 260px;
  border-radius: 15px;
  padding: 10px;
  margin-top: 5px;
  margin-left: -10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.IntroInfoContainer:hover {
  background-color: rgb(95, 95, 95);
}

.IntroItem {
  margin-left: auto;
  margin-right: auto;
  font-weight: 300;
  font-style: normal;
  font-size: 35px;
  line-height: 1.8;
}

#IntroInfoLabel {
  float: left;
  font-size: 25px;
  margin-top: 0px;
  margin-left: 20px;
  font-weight: 100;
}

#IntroInfoButton {
  float: left;
  margin-top: 0px;
  height: 30px;
  width: 30px;
  background-image: url(../assets/linkbutton_white.png);
  background-size: 30px 30px;
}


</style>
