<template>
  <div class="progress">
    <div class="progressBar">
      <div class="progressBar__dot" v-for="n in finalLocaiton" :class="{ active: locationVisited(n) }" :key="n"></div>
    </div>
    <div class="jumpButton" :class="{ active: canJump }">
      Activate jumpdrive (j)
    </div>
    <div class="jumpStatusText">{{ jumpStatusText }}</div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    name: 'UIProgress',
    components: {
    },
    methods: {
      locationVisited(n) {
        return n <= this.currentLocation
      }
    },
    computed: {
      currentLocation() {
        return store.state.currentLocation
      },
      finalLocaiton() {
        return store.state.finalLocaiton
      },
      canJump() {
        return store.state.resources.fuel >= store.state.fuelRequirement && store.state.shuttleDockedToMothership
      },
      jumpStatusText() {
        let text = 'jumpdrive online'
        if(!store.state.shuttleDockedToMothership) {
          text = 'Shuttle not docked'
        }

        if(store.state.resources.fuel < store.state.fuelRequirement) {
          text = 'Not enough fuel'
        }

        return text
      }
    }
  }
</script>

<style lang="scss" scoped>
  .progress {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    line-height: 1;
    text-align: center;
    color: #fff;
  }

  .progressBar {
    &__dot {
      height: 10px;
      width: 10px;
      position: relative;
      margin: 0 50px;
      display: inline-block;
      border-radius: 100%;
      border: solid 1px #fff;
      transition: background-color 1s 0.5s;

      &:not(:first-child):before {
        content: '';
        width: 85px;
        height: 2px;
        position: relative;
        right: 94px;
        top: 2px;
        display: block;
        border: solid 1px #fff;
        border-radius: 100px;
        transition: background-color 1s;
      }

      &.active {
        background-color: #fff;

        &:not(:first-child):before {
          background-color: #fff
        }
      }
    }
  }

  .jumpButton {
    display: inline-block;
    margin-top: 10px;
    padding: 4px;
    border: solid 1px #7F7F7F;
    color: #7F7F7F;

    transition: border-color 1s, border-color 1s, color 1s;

    &.active {
      border-color: #fff;
      color: #fff;
    }
  }

  .jumpStatusText {
    margin-top: 10px;
  }
</style>
