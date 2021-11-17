import React from "react";
import Main from "./components/MainComponent";
import { Provider } from "react-redux";
import { ConfigureStore } from "./redux/configureStore";

const store = ConfigureStore();

export default function App() {
  //Wrapping it like this gives all the child components the ability to connect to the redux store
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
