import {
  Route,
  Outlet,
  useNavigate,
  useLocation,
  Routes,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SideLayout from "./components/_tailwindui/SideLayout";
import { useEffect, useState } from "react";
import { useAuthCookie, useUserAuthCookie } from "./hooks/Cookie";
import { Loader2 } from "lucide-react";
import LocationPage from "./pages/Location";
import CityViewPage from "./pages/Location/[_city]";
import BusPage from "./pages/Bus";
import BusViewPage from "./pages/Bus/[_bus]";
import ScheduleViewPage from "./pages/Bus/[_schedule]";
import PassengerPage from "./pages/Passenger";
import RoutePage from "./pages/Route";
import BusListViewPage from "./pages/Route/[_bus]";
import UserBooking from "./components/Bus/UserBooking";
import ErrorPage from "./pages/Error";
import UserProfilePage from "./pages/User/Profile";
import OperatorProfilePage from "./pages/Operator/Profile";

function App() {
  const [loading] = useState<boolean>(false);
  const cookie = useAuthCookie();
  const userCookie = useUserAuthCookie();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.split("/")[1] === "operator" && !cookie) {
      navigate("/login");
    }
    if (location.pathname.split("/")[1] === "user" && !userCookie) {
      navigate("/");
    }
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin h-16 w-16" />
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <>
            <Outlet />
          </>
        }
      >
        <Route index path="/" element={<RoutePage />} />
        <Route path="/route/bus" element={<BusListViewPage />} />
        <Route path="/user/schedule/book/:id" element={<UserBooking />} />
        <Route path="/user/profile" element={<UserProfilePage />} />
      </Route>
      <Route
        path="/"
        element={
          <SideLayout>
            <Outlet />
          </SideLayout>
        }
      >
        <Route path="/operator/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/operator/locations" element={<LocationPage />} />
        <Route path="/operator/locations/city/:id" element={<CityViewPage />} />
        <Route path="/operator/buses" element={<BusPage />} />
        <Route path="/operator/buses/bus/:id" element={<BusViewPage />} />
        <Route
          path="/operator/buses/schedule/:id"
          element={<ScheduleViewPage />}
        />
        <Route path="/operator/passengers" element={<PassengerPage />} />
        <Route path="/operator/profile" element={<OperatorProfilePage />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
