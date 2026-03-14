import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { setStore } from "./redux/storeRef";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";

setStore(store);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="545040228507-l8e0ap0v20jcmrmra1mar3akri99dson.apps.googleusercontent.com">
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </GoogleOAuthProvider>
);
