import { useHistory } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
  const history = useHistory();

  return (
    <div onClick={() => history.goBack()} className="back_botton_sec"> <FaArrowLeft size={20} color={"#257b69"}/> {' '}Back</div>
  );
};

export default BackButton;

