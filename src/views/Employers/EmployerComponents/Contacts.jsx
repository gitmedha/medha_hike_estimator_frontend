import { useMemo } from "react";
import Table from "../../../components/content/Table";
import { Anchor } from "../../../components/content/Utils";
import { useEffect } from "react";

const Contacts = ({ contacts }) => {
  contacts = contacts.map((contact) => {
    contact.full_name = contact.full_name.replace(/\b\w/g,(match)=>{
      return match.toUpperCase();
    })
    contact.designation =contact.designation.replace(/\b\w/g,(match)=>{
      return match.toUpperCase();
    })
    contact.email_id = <Anchor text={contact.email} href={'mailto:' + contact.email} />;
    return contact;
  });
  const columns = useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: 'full_name',
      },
      {
        Header: 'Designation',
        accessor: 'designation',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
    ],
    []
  );

  return (
    <div className="container-fluid my-3">
      <Table columns={columns} data={contacts} paginationPageSize={contacts.length} totalRecords={contacts.length} fetchData={() => { }} loading={false} />
    </div>
  );
};

export default Contacts;
