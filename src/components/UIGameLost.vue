<template>
  <div class="gameLost">
    <div class="content">
      <h1>Game lost</h1>
      <div>Fuel: {{fuel}} Oxygen: {{oxygen}}</div>
      <div>Press enter to try again</div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    name: 'UIGameLost',
    components: {
      
    },
    computed: {
      fuel() {
        return store.state.resources.fuel
      },
      oxygen() {
        return store.state.resources.oxygen.toFixed(1)
      }
    }
  }
</script>

<style lang="scss">
  .gameLost {
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
