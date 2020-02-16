<template>
  <v-app>
    <v-app-bar app color="warning" dark>
      <v-toolbar-title>
        <v-btn href="/" text>Makao</v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-for="item in menu" :key="item.name" :href="item.path" text>{{ item.name }}</v-btn>

      <v-btn href="https://github.com/skdltmxn/makao" target="_blank" icon>
        <v-icon large>mdi-github-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  mounted() {
    this.menu = this.$router.options.routes.filter(r => r.path !== "/");
  },

  data: () => ({
    menu: []
  })
};
</script>
