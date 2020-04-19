<template>
  <div class="gameWon">
    <div class="content">
      <h1>Game won</h1>
      <div>Press enter to play again</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UIGameWon',
    components: {
      
    }
  }
</script>

<style lang="scss">
  .gameWon {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    background-color: #000
  }

  .content {
    width: 100%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    line-height: 1.5;
  }
</style>
