import api from "../../../apis";
export const getEmployee = async (id)=>{
    try{
        const response = await api.get(`/api/employees/get_employee/${id}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const searchEmployees = async (searchField,searchValue,paginationPageSize=25,paginationPageIndex=0) => {
    try {
        const body = { searchField,searchValue, limit:paginationPageSize,page:paginationPageIndex }; 
        const response = await api.post('/api/employees/search_employees', body, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


export const LoadSearchPicklist = async (dropDownField) => {
    try{
        const response = await api.get(`/api/employees/search_picklist/${dropDownField}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const getEmployeeHistoricsData = async(firstName,lastName,sortBy="reviewer", sortOrder="asc")=>{
    try{
        const response = await api.get(`/api/employees/get_employee_historical_data/${firstName}/${lastName}/${sortBy}/${sortOrder}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const getEmployeePicklist = async ()=>{
    try{
        const response = await api.get(`/api/employees/get_employee_picklists`);
        console.log(response)
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const createEmployee = async (employeeData)=>{
    try{
        const response = await api.post(`/api/employees/create_employee`, employeeData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    }catch(error){
        console.error(error);
    }

}

export const updateEmployee = async (employeeData,id)=>{
    try{
        const response = await api.put(`/api/employees/edit_employee/${id}`, employeeData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const deleteEmployee = async (id)=>{
    try{
        const response = await api.delete(`/api/employees/delete_employee/${id}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const downloadTableExcel  = async ()=>{
    try{
        const response = await api.get('/api/employees/download_excel',{
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'employee_details.xlsx';
        link.click();

        URL.revokeObjectURL(link.href);
    }catch(error){
        console.error(error);
    }
}

export const uploadExcelData = async ()=>{
    try{
        const response = await api.post('/api/employees/upload_excel', {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}