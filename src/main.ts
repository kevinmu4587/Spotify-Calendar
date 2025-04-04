import './assets/main.css'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

import { createApp } from 'vue'
import App from './components/App.vue'
import HeaderBar from './components/HeaderBar.vue'
import { vuetify } from '../vuetify'

import 'vuetify/styles'

const app = createApp(App)
app.use(vuetify)
app.use(VCalendar, {})
app.mount('#app')

const headerApp = createApp(HeaderBar)
headerApp.mount('#header-bar')
