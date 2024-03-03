import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Main from "./Main";
import History from "./History";

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Main />} />
        <Route path="/history" element={<History />} />
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
};

export default App;

const Root: React.FC = () => (
  <>
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Main
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/history" className="nav-link">
            History
          </Link>
        </li>
      </ul>
    </nav>
    <div>
      <Outlet />
    </div>
  </>
);
