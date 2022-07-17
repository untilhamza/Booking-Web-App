import { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./components/NavBar/Navbar";
import Admin from "./pages/Admin";
import SignIn from "./pages/SignIn";
import Customer from "./pages/Customer";
import NewBooking from "./pages/NewBooking";
import ViewAppointment from "./pages/ViewAppointment";
import CheckAppointment from "./pages/CheckAppointment";
import Logout from "./components/Logout/Logout";
import SettingsPage from "./pages/SettingsPage";
import GeneralSettingsPage from "./pages/GeneralSettingsPage";
import SlotSettingsPage from "./pages/SlotSettingsPage";
import SpecialDaySettingsPage from "./pages/SpecialDaySettingsPage";
import NotFound from "./pages/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AuthContext from "./store/auth-context";

const { Content } = Layout;

const App = () => {
  const authCtx = useContext(AuthContext);
  return (
    <div className="App">
      <Layout className="min-vh-100">
        <Navbar />
        <Content className="w-100">
          <Switch>
            <Route path="/login">
              <SignIn />
            </Route>
            <Route path="/new-booking">
              <NewBooking />
            </Route>

            <Route path="/admin">
              {authCtx.isLoggedIn && <Admin />}
              {!authCtx.isLoggedIn && <Redirect to="/login" />}
            </Route>
            <Route path="/check-appointment">
              {/* maybe pass the appointment id so it can be fetched */}
              <CheckAppointment />
            </Route>
            <Route path="/appointment/:id">
              <ViewAppointment />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/settings">
              <SettingsPage />
            </Route>
            <Route path="/general-settings">
              <GeneralSettingsPage />
            </Route>
            <Route path="/slot-settings">
              <SlotSettingsPage />
            </Route>
            <Route path="/special-settings">
              <SpecialDaySettingsPage />
            </Route>
            <Route path="/">
              <Customer />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </div>
  );
};

export default App;
