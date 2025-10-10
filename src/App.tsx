import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DocumentDetail from "./pages/DocumentDetail";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail/:documentId" element={<DocumentDetail />} />
      <Route path="/checkout/:documentId" element={<Checkout />} />
    </Routes>
  );
}

export default App;
