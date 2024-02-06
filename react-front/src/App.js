// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './scripts/main';
import ProductPage from './scripts/product';
import SearchPage from './scripts/search';
import DropDown from './components/dropdown';
import Deneme from './scripts/deneme';
import WishList from './scripts/wishlist';
// import ProductPage from './ProductPage';

const App = () => {
  // console.log("App rendered");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/search-page/:query" element={<SearchPage />} />
        <Route path="/dropdown" element={<DropDown/>} />
        <Route path="/deneme" element={<Deneme />} />
        <Route path="/wishlist" element={<WishList />} />
      </Routes>
    </Router>
  );
};

export default App;
