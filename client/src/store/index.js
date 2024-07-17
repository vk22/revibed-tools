import { createStore } from "vuex";
import { main } from "./main.module";
import { auth } from "./auth.module";


const store = createStore({
  modules: {
    main,
    auth
  },
});

export default store;
