import moment from "moment";
import { useMemo } from "react";
import Table from "../../../components/content/Table";
import { Anchor } from "../../../components/content/Utils";

const MoUs = props => {
  const mous = props.mou.map(mou => {
    const fileName = mou.mou_file.url.substring(mou.mou_file.url.lastIndexOf('/')+1);
    return {
      ...mou,
      mou_file_url_display: <Anchor text={fileName} href={mou.mou_file.url} target="_blank" />,
      start_date_display: moment(mou.start_date).format('DD MMM yy'),
      end_date_display: moment(mou.end_date).format('DD MMM yy'),
    }
  });

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'mou_file_url_display',
      },
      {
        Header: 'Start Date',
        accessor: 'start_date_display',
      },
      {
        Header: 'End Date',
        accessor: 'end_date_display',
      },
    ],
    []
  );

  return (
    <div className="container-fluid my-3">
      <Table
        columns={columns}
        data={mous}
        paginationPageSize={mous.length}
        totalRecords={mous.length}
        fetchData={() => {}}
        loading={false}
        showPagination={false}
      />
    </div>
  );
};

export default MoUs;
