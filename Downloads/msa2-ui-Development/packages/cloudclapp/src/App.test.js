import React from "react";
import { render } from "cloudclapp/src/utils/test-utils";
import App from "./App";
import configureMockStore from "redux-mock-store";
import initialState from "cloudclapp/src/store/initialState";
import { Provider } from "react-redux";

const mockStore = configureMockStore();
describe("App", () => {
  it("renders correctly", () => {
    const store = mockStore(initialState);
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
