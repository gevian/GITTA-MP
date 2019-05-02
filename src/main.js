import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

require("@/css/app.css");
require("@/css/stretch_widget.css")

new Vue({
  render: h => h(App),
}).$mount('#app')
