import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import SportsPage from "./pages/SportsPage";
import StadiumsPage from "./pages/StadiumsPage";
import VendorsPage from "./pages/VendorsPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import TrackPage from "./pages/TrackPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<SportsPage />} />
        <Route path="sport/:sportId" element={<StadiumsPage />} />
        <Route path="stadium/:stadiumId" element={<VendorsPage />} />
        <Route path="stadium/:stadiumId/vendor/:vendorId" element={<MenuPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="track/:orderId" element={<TrackPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
