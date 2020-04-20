<template>
  <div class="resources">
    <span>Fuel: {{ fuel }}</span> <span>Scrap: {{ scrap }}</span> <span>Oxygen: {{ oxygen }}</span> <span>Structure: <div class="bar" :value="mothershipStructure"></div></span>
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
      },
      scrap() {
        return store.state.resources.scrap
      },
      mothershipStructure() {
        return store.state.resources.mothershipStructure
      }
    }
  }
</script>

<style lang="scss" scoped>
  span {
    margin-right: 10px;
  }

  .resources {
    position: absolute;
    bottom: 10px;
    left: 10px;
    line-height: 1;
    color: #fff;
  }

  .bar {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 10px;
    border: solid 2px #fff;
    transform-style: preserve-3d;

    &:after {
      content: '';
      display: block;
      position: absolute;
      left: -2px;
      top: -2px;
      width: 100px;
      height: 10px;
      background-color: green;
      transform: translateZ(-1px);
    }

    @for $percent from 1 through 100 {
        &[value="#{$percent}"]:after {
          width: #{$percent}px;
          @if $percent > 66 {
            background-color: green;
          } @else if $percent > 33 {
            background-color: orange;
          } @else if $percent <= 33 {
            background-color: red;
          }
        }
      }
  }
</style>
