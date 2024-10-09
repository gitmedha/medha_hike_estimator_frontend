import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useFormikContext, getIn } from "formik";
import Table from "./Table";
import Input from "./Input";

const EMPTY_ARR = [];

function Friends({ name, handleAdd, handleRemove }) {
    const { values } = useFormikContext();

    // from all the form values we only need the "friends" part.
    // we use getIn and not values[name] for the case when name is a path like `social.facebook`
    const formikSlice = getIn(values, name) || EMPTY_ARR;
    const [tableRows, setTableRows] = useState(formikSlice);

    // we need this so the table updates after the timeout expires
    useEffect(() => {
        setTableRows(formikSlice);
    }, [formikSlice]);

    const onAdd = useCallback(() => {
        const newState = [...tableRows];
        const item = {
            id: tableRows.length + 1,
            firstName: "",
            firstName1: "", firstName2: "", firstName3: "", firstName4: "",firstName5: "",
            lastName: ""
        };

        newState.push(item);
        setTableRows(newState);
        handleAdd(item);
    }, [handleAdd, tableRows]);

    const onRemove = useCallback(
        index => {
            const newState = [...tableRows];

            newState.splice(index, 1);
            setTableRows(newState);
            handleRemove(index);
        },
        [handleRemove, tableRows]
    );

    const columns = useMemo(
        () => [
            {
                Header: "Id",
                accessor: "id"
            },
            {
                Header: "First Name",
                id: "firstName",
                Cell: ({ row: { index } }) => (
                    <Input name={`${name}[${index}].firstName`} />
                )
            },
            {
                Header: "First Name",
                id: "firstName1",
                Cell: ({ row: { index } }) => (
                    <Input name={`${name}[${index}].firstName1`} />
                )
            },
            {
                Header: "First Name1",
                id: "firstName2",
                Cell: ({ row: { index } }) => (
                    <Input name={`${name}[${index}].firstName2`} />
                )
            },
            {
                Header: "First Name2",
                id: "firstName3",
                Cell: ({ row: { index } }) => (
                    <Input name={`${name}[${index}].firstName3`} />
                )
            },
            {
                Header: "First Name3",
                id: "firstName4",
                Cell: ({ row: { index } }) => (
                    <Input name={`${name}[${index}].firstName4`} />
                )
            },
            {
                Header: "First Name4",
                id: "firstName5",
                Cell: ({ row: { index } }) => (
                    <Input name={`${name}[${index}].firstName5`} />
                )
            },
            {
                Header: "Last Name",
                id: "lastName",
                Cell: ({ row: { index } }) => (
                    <Input name={`${name}[${index}].lastName`} />
                )
            },
            {
                Header: "Last Name",
                id: "lastName1",
                Cell: ({ row: { index } }) => (
                    <Input name={`${name}[${index}].lastName1`} />
                )
            },
            {
                Header: "Actions",
                id: "actions",
                Cell: ({ row: { index } }) => (
                    <button type="button" onClick={() => onRemove(index)}>
                        delete
                    </button>
                )
            }
        ],
        [name, onRemove]
    );

    return (
        <div className="field">
            <div>
                Friends:{" "}
                <button type="button" onClick={onAdd}>
                    add
                </button>
            </div>
            <Table data={tableRows} columns={columns} rowKey="id" />
        </div>
    );
}

export default React.memo(Friends);
