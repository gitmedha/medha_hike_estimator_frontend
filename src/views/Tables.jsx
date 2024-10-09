import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const columns = [
  {
    dataField: "id",
    text: "Product ID",
  },
  {
    dataField: "name",
    text: "Product Name",
    sort: true,
    filter: textFilter(),
  },
  {
    dataField: "price",
    text: "Product Price",
  },
  {
    text: "Action",
    dataField: "actions",
  },
];

const products = [
  {
    id: 1,
    price: 299,
    name: "Product 1",
  },
  {
    id: 2,
    price: 399,
    name: "Product 2",
  },
  {
    id: 3,
    price: 499,
    name: "Product 3",
  },
  {
    id: 4,
    price: 299,
    name: "Product 4",
  },
  {
    id: 5,
    price: 599,
    name: "Product 5",
  },
  {
    id: 6,
    price: 199,
    name: "Product 6",
  },
  {
    id: 7,
    price: 199,
    name: "Product 7",
  },
  {
    id: 8,
    price: 199,
    name: "Product 8",
  },
  {
    id: 9,
    price: 199,
    name: "Product 9",
  },
  {
    id: 10,
    price: 199,
    name: "Product 10",
  },
  {
    id: 11,
    price: 199,
    name: "Product 11",
  },
  {
    id: 12,
    price: 199,
    name: "Product 12",
  },
  {
    id: 13,
    price: 199,
    name: "Product 13",
  },
  {
    id: 14,
    price: 199,
    name: "Product 14",
  },
  {
    id: 15,
    price: 199,
    name: "Product 15",
  },
];

const filterOptions = {};

const paginationOptions = {
  sizePerPage: 2,
};

export default () => (
  <div className="card">
    <div className="card-body">
      <BootstrapTable
        keyField="id"
        data={products}
        columns={columns}
        filter={filterFactory(filterOptions)}
        pagination={paginationFactory(paginationOptions)}
      />
    </div>
  </div>
);
