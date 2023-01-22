import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Singup from './pages/singup/Singup';
import Login from './pages/login/Login';
import firebaseConfig from './firebaseConfig';
import Home from './pages/Home/Home';
import store from './store'
import { Provider } from 'react-redux'
import Forgetpassword from './pages/forgetpass/index';
import Message from './pages/message/Message';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Singup/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/forgot",
    element: <Forgetpassword/>,
  },
  {
    path: "/msg",
    element: <Message/>,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <RouterProvider router={router} />
  </Provider>
);

