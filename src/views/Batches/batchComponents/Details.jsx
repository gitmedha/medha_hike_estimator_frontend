import { useState, useEffect, useMemo } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Anchor, Badge, ProgressBarField } from "../../../components/content/Utils";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import DetailField from "../../../components/content/DetailField";
import { getBatchesPickList } from "../batchActions";
import Table from '../../../components/content/Table';
import moment from "moment";

const Details = ({ batch, sessions=[] }) => {
  const [pickList, setPickList] = useState([]);
  useEffect(() => {
    getBatchesPickList().then(data => {
      setPickList(data);
    });
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'Sessions planned',
        accessor: 'sessions_planned',
        disableSortBy: true,
      },
      {
        Header: 'Per-student fees',
        accessor: 'per_student_fees',
        disableSortBy: true,
      },
      {
        Header: 'Seats Available',
        accessor: 'seats_available',
        disableSortBy: true,
      },
    ],
    []
  );

  const batchTableData = [
    {
      sessions_planned: batch.number_of_sessions_planned,
      per_student_fees: batch.per_student_fees,
      seats_available: batch.seats_available || 0,
    }
  ];

  let totalSessionAttendancePercentages = 0;
  sessions.map(session => {
    return totalSessionAttendancePercentages += session.percent || 0;
  });
  const averageAttendancePercent = Math.floor(totalSessionAttendancePercentages / sessions.length);

  return (
    <div className="container-fluid my-3 latto-regular">
      <div className="row">
        <div className="row justify-content-between">
          <div className="col-12  col-sm-5">
            <DetailField label="Name"  value={batch.name} />
          </div>
          <div className="col-12  col-sm-6">
          <DetailField label="Assigned To" value={batch.assigned_to?.username} />
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-sm-5">
            <DetailField label="Program Name" value={batch?.program?.name} />
          </div>
          <div className="col-12 col-sm-6">
            <DetailField label="Status" value={<Badge value={batch.status} pickList={pickList.status} />} />          
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-sm-5">
          <DetailField label="Institution" value={<Anchor text={batch?.institution?.name} href={`/institution/${batch?.institution?.id}`} />} />
          </div>
          <div className="col-12 col-sm-6">
          <DetailField label="Enrollment Type" value={<Badge value={batch.enrollment_type} pickList={pickList.enrollment_type} />} />
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-sm-5">
          <DetailField label="Start Date" value={<Moment date={batch.start_date} format={"DD MMM YYYY"} />} />
          &nbsp;          </div>
          <div className="col-12 col-sm-6">
          <DetailField label="End Date" value={<Moment date={batch.end_date} format={"DD MMM YYYY"} />} />
          &nbsp;
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-sm-5">
          <DetailField label="State" value={batch.state} />
          </div>
          <div className="col-12 col-sm-6">
          <DetailField label="Area" value={batch.medha_area} />
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-sm-5">
          <DetailField label="Grant" value={batch.grant?.name} />
          </div>
          <div className="col-12 col-sm-6">

          <DetailField label="Donor" value={batch.grant?.donor} />
          &nbsp;          </div>
        </div>

        <div className="row justify-content-between">
          <div className="col-12 col-sm-5">
          <DetailField label="Session Planned" value={batch.number_of_sessions_planned} />
          </div>
          <div className="col-12 col-sm-6">
          <DetailField label="Per Student Contribution" value={batch.per_student_fees} />
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-sm-5">
          <DetailField label="Seats Available" value={ batch.seats_available || 0} />
          </div>
          <div className="col-12 col-sm-6">
          <DetailField label="Mode of Payment" value={batch.mode_of_payment} />
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-sm-5">
          <DetailField label="Created By" value={batch.created_by_frontend?.username ?`${batch.created_by_frontend?.username} (${batch.created_by_frontend?.email})`: ''} />
          </div>
          <div className="col-12 col-sm-6">
          <DetailField label="Updated By" value={batch.updated_by_frontend?.username ?`${batch.updated_by_frontend?.username} (${batch.updated_by_frontend?.email})`: ''} />
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-sm-5">
          <DetailField label="Created At" value={moment(batch.created_at).format("DD MMM YYYY, h:mm a")} />
          </div>
          <div className="col-12 col-sm-6">
          <DetailField label="Updated At" value={moment(batch.updated_at).format("DD MMM YYYY, h:mm a")} />
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-12 col-sm-6">
            <div className="mt-2">
              <div style={{color: '#787B96', fontFamily: 'Latto-Regular', fontSize: '14px', lineHeight: 2.2, marginBottom: '10px', marginTop: '10px'}}>
                Average Attendance Across All Sessions
              </div>
              <ProgressBarField value={averageAttendancePercent} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});
const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Details);
