import BookingMenu from "../components/BookingMenu/BookingMenu";
import { useHistory } from "react-router-dom";
import About from "../components/About/About";
import "./homepage.css";

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
    <div className="container homepage">
      <About />
      <BookingMenu
        onMakeAppointment={handleMakeAppointment}
        onModifyAppointment={handleModifyAppointment}
        onBack={handleGoBack}
      />

      <div className="right-image">right</div>
    </div>
  );
};

export default BookingPage;
