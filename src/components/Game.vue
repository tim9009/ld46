<template>
  <div class="Game">
    <canvas id="vroom-canvas" width="1920" height="1080"></canvas>
  </div>
</template>

<script>
  import store from '@/store'

  import { Vroom } from '../game/vroom/vroom.js'

  // Import game
  import init from '@/game/init'
  import start from '@/game/start'
  import game from '@/game/main'

  export default {
    name: 'Game',
    components: {
      
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
      game.updateViewportSize()
    },
    methods: {
      handleWindowResize() {
        Vroom.updateSize()
      }
    },
    computed: {
      gameStarted() {
        return store.state.gameStarted
      },
      communicationVisible() {
        return store.state.communication.visible
      },
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

  .Game {
    line-height: 0
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
