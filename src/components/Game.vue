<template>
  <div class="game">
    <canvas id="vroom-canvas" width="1920" height="1080"></canvas>
    
    <transition name="fade">
      <UIResources/>
    </transition>

    <transition name="fade">
      <UIGameLost v-if="gameLost"/>
    </transition>

    <transition name="fade">
      <UIGameWon v-if="gameWon"/>
    </transition>
  </div>
</template>

<script>
  import store from '@/store'

  import UIResources from './UIResources.vue'
  import UIGameLost from './UIGameLost.vue'
  import UIGameWon from './UIGameWon.vue'

  import { Vroom } from '../game/vroom/vroom.js'

  // Import game
  import init from '@/game/init'
  import start from '@/game/start'
  import '@/game/main'

  export default {
    name: 'Game',
    components: {
      UIResources,
      UIGameLost,
      UIGameWon
    },
    created() {
      window.addEventListener("resize", this.handleWindowResize)
    },
    mounted() {
      init()
      start()
    },
    destroyed() {
      window.removeEventListener("resize", this.handleWindowResize)
    },
    updated() {
    },
    methods: {
      handleWindowResize() {
        Vroom.updateSize()
      }
    },
    computed: {
      gameLost() {
        return store.state.gameLost
      },
      gameWon() {
        return store.state.gameWon
      }
    }
  }
</script>

<style lang="scss">
  // @import '../styles/components/Game';

  .game {
    line-height: 0;
    font-family: monospace;
    font-size: 12px;
  }

  .fade-leave-active {
    transition: all 150ms ease-in-out;
  }

  .fade-leave {
    opacity: 1;
  }

  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active {
    transition: all 150ms ease-in-out;
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-to {
    opacity: 1;
  }
</style>
