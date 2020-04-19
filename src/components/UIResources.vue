<template>
  <div class="resources">
    <span>Fuel: {{fuel}}</span> <span>Oxygen: {{oxygen}}</span>
  </div>
</template>

<script>
  import store from '@/store'
  
  export default {
    name: 'UIResources',
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

<style lang="scss" scoped>
  .resources {
    position: absolute;
    top: 10px;
    left: 10px;
    line-height: 1;
    color: #fff;
  }
</style>
