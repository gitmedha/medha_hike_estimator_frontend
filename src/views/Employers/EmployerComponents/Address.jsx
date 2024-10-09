import DetailField from "../../../components/content/DetailField";

const Address = ({ address, medha_area, pin_code, state, city, district }) => {
  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-6 col-md-4">
          <DetailField label="Address" className="capitalize" value={address} />
          <DetailField label="City"  className="capitalize" value={city} />
          <DetailField label="District" value={district} />
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Pin Code" value={pin_code} />
          <DetailField label="Area" value={medha_area} />
          <DetailField label="State" value={state} />
        </div>
      </div>
    </div>
  );
};

export default Address;
