import BookingMenu from "../components/BookingMenu/BookingMenu";
import { useHistory } from "react-router-dom";
import TrackingCode from "../components/TrackingCode";
import "./homepage.css";
import MainBackground from "../components/UI/MainBackground";
import GoogleAnalytics from "../components/GoogleAnalytics";

const BookingPage = () => {
  const history = useHistory();
  const handleMakeAppointment = () => {
    const path = "/new-booking";
    history.push(path);
  };
  const handleModifyAppointment = () => {
    const path = "/check-appointment";
    history.push(path);
  };
  const handleGoBack = () => {
    history.goBack();
  };
  return (
    <MainBackground>
      <GoogleAnalytics />
      <div className="container homepage">
        <BookingMenu onMakeAppointment={handleMakeAppointment} onModifyAppointment={handleModifyAppointment} onBack={handleGoBack} />
      </div>
    </MainBackground>
  );
};

export default BookingPage;
