/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
//  */

// Plugins
import vuetify from './vuetify'
import store from '../store'
import router from '../router'

// Custom
import helpers from './globalFunc.js'

// console.log('helpers ', helpers)

// const myPlugin = {
//   install() {
//       Vue.helpers = helpers;
//       Vue.prototype.$helpers = helpers;
//   }
// }


export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(store)
    .use(router)
    .use(helpers, {
      greetings: {
        hello: 'Bonjour!'
      }
    })
}
