<template>
  <footer id="footer">
    <div id="CDHLogo" style="margin-left:40px;margin-top:0px; width:210px;padding: 20px 0px 30px 0px; border-style:solid; border-width:0px 0px 0px 0px; border-color:white;">Centre<br><span class="logo-for">for</span>Digital <br>Humanities</div>
    
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
  background-color: rgb(0,0,0,0.0);
  color: white;
  line-height: 1.3;
  height: auto;
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
   float:right;

      	margin-right:0px;
            width: auto;
            height: auto;
            text-align: left;
            font-weight: 100;
            font-style: normal;
            font-size: 45px;
            line-height: 0.8;
            padding: 30px 0px 30px 0px;
            vertical-align: middle;
            font-family: 'Barlow Condensed', sans-serif;

        }

        .logo-for{
         font-family: 'Clicker Script', cursive; 
         font-size:25px;  
         vertical-align:50%;
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



@media screen and (max-width: 950px) {

  #CDHLogo {
    float:left;
left:calc(30px);
            font-size: 65px;
        }

          .logo-for{
         font-size:35px;  
         vertical-align:50%;
        }
}


</style>
