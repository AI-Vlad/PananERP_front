<template>
  <div id="app">
    <sidebar></sidebar>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<style>
/* REMOVE SCROLLBAR */
html {
    overflow: scroll;
    overflow-x: hidden;
}
::-webkit-scrollbar {
    width: 0px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  width: 100%;
}

#content {
  padding: 30px;
  margin-left: 230px;
  width: calc(100vw - 230px);
  height: 100vh;
}
</style>
