import { useMemo } from "react";
import Table from "../../../components/content/Table";
import { Anchor } from "../../../components/content/Utils";

const Contacts = ({ contacts }) => {

  let convertText = (sentence) => sentence
   .toLowerCase()
   .replace(new RegExp(/[-_]+/, 'g'), ' ')
   .replace(new RegExp(/[^\w\s]/, 'g'), '')
   .trim()
   .split(' ')
   .map(word => word[0]
   .toUpperCase()
  .concat(word.slice(1)))
   .join(' ');

  contacts = contacts.map((contact) => {
    let name =contact.full_name;
    let designation=contact.designation;
    contact.full_name=convertText(name);
    contact.designation=convertText(designation)
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
        accessor: 'email_id',
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
      <Table
        columns={columns}
        data={contacts}
        paginationPageSize={contacts.length}
        totalRecords={contacts.length}
        fetchData={() => {}}
        loading={false}
        showPagination={false}
      />
    </div>
  );
};

export default Contacts;
