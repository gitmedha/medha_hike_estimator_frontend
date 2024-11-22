import api from "../../../apis";
export const getEmployee = async (id)=>{
    try{
        const response = await api.get(`/api/employees/get_employee/${id}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const searchEmployees = async (searchValue, from = null, to = null,paginationPageSize=25,paginationPageIndex=0) => {
    try {
        const body = { searchValue, limit:paginationPageSize,page:paginationPageIndex };
        if (from && to) {
            body.from = from;
            body.to = to;
        }
                
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

export const getEmployeeHistoricsData = async(firstName,lastName)=>{
    try{
        const response = await api.get(`/api/employees/get_employee_historical_data/${firstName}/${lastName}`);
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