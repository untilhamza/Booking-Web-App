import BookingMenu from "../components/BookingMenu";
import { useHistory } from "react-router-dom";

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
    <div>
      <BookingMenu
        onMakeAppointment={handleMakeAppointment}
        onModifyAppointment={handleModifyAppointment}
        onBack={handleGoBack}
      />
    </div>
  );
};

export default BookingPage;
