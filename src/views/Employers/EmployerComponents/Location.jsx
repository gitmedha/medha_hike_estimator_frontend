import DetailField from "../../../components/content/DetailField";

const Location = ({ name, employer, status, address, phone, email }) => {
  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-6 col-md-4">
          <DetailField label="Name" className="capitalize"value={name} />
          <DetailField label="Employer" value={employer} />
          <DetailField label="Status" value={status} />
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Email" value={email} />
          <DetailField label="Address" value={address} />
          <DetailField label="Phone" value={phone} />
        </div>
      </div>
    </div>
  );
};

export default Location;
