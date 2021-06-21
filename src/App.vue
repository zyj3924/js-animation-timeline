<template>
  <div id="app">
    <div id="box" ref='box'></div>
    <button id="pause" ref="start" @click="start">start</button>
    <button id="pause" ref="pause" @click="pause">pause</button>
    <button id="resume" ref="resume" @click="resume">resume</button>
    <button id="pause" ref="reset" @click="reset">reset</button>
  </div>
</template>

<script>
import {Timeline, Animation} from './static/js/timeline'

export default {
  name: 'App',
  data () {
    return {
      tl:null
    }
  },
  methods: {
    start(){
      let element = this.$refs.box
      let animation = new Animation(element, 'style', 0, 400, 4000, 0, null, (x) => `transform:translateX(${x}px)`)
      this.tl.add(animation)
      this.tl.start()
    },
    pause () {
      this.tl.pause()
    },
    resume () {
      this.tl.resume()
    },
    reset () {
      this.tl.reset()
      let element = this.$refs.box
      element.style = ''
    }
  },
  mounted () {
    this.tl = new Timeline()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#box{
  width: 100px;
  height:100px;
  background: lightblue;
}
</style>
