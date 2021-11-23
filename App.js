import React from "react";
import Main from "./components/MainComponent";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./components/LoadingComponent";

const { store, persistor } = ConfigureStore();

export default function App() {
  //Wrapping it like this gives all the child components the ability to connect to the redux store
  // PersistGate helps integrate persist with React. Prevents the app from rendering unless the redux store has hydrated fully from client side storage 
  return (
    <Provider store={store}>
      <PersistGate 
        loading={<Loading />}
        persistor={persistor}>
        <Main />
      </PersistGate>
    </Provider>
  );
}
