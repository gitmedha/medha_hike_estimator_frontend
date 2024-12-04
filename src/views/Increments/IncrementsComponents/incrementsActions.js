import api from "../../../apis";


export const fetchAllIncrements = async(offset,limit,sortBy='employee_id',sortOrder='asc')=>{
    try{
        const response = await api.get(`/api/increments/get-increment-data/${limit}/${offset}/${sortBy}/${sortOrder}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const fetchIncrement = async(incrementId) => {
    try{
        const response = await api.get(`/api/increments/get-increment-data/${incrementId}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const createIncrement = async(incrementData) => {
    try{
        const response = await api.post(`/api/increments/create-increment-data`, incrementData);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const updateIncrement = async(incrementData,incrementId) => {
    try{
        const response = await api.put(`/api/increments/edit-increment-data/${incrementId}`, incrementData);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const deleteIncrement = async(incrementId) => {
    try{
        const response = await api.delete(`/api/increments/delete-increment-data/${incrementId}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const fetchIncrementPickList = async() => {
    try{
        const response = await api.get(`/api/increments/get_increments_picklist`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const fetchFilterPicklist = async()=>{
    try{
        const response = await api.get(`/api/increments/get_filter_picklist`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const applyFilterActions = async(filterData,offset,limit)=>{
    try{
        const response = await api.post(`/api/increments/add-filter-increment-data/${offset}/${limit}`, 
            {"fields":filterData[0].fields,
            "values":filterData[0].values
            });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const fetchSearchDropdown = async(field)=>{
    try{
        const response = await api.get(`/api/increments/search-dropdowns/${field}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const calculateNormalizedRating = async (employeeId,reviewCycle,ratings,reviewer) =>{
    try{
        const response = await api.post('/api/increments/calculate_normalized_rating', {
            "ratings": ratings,
            "employeeId": employeeId,
            "reviewCycle": reviewCycle,
            "managerName":reviewer
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const calculateIncrement = async(employeeId,reviewCycle,normalizedRating)=>{
    try{
        const response = await api.post('/api/increments/get_increment', {
            "employeeId": employeeId,
            "reviewCycle": reviewCycle,
            "normalizedRating": normalizedRating
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const search = async(field,value,limit,page)=>{
    try{
        const response = await api.post(`/api/increments/search-increment-data`, {
            "field": field,
            "value": value,
            "offset": page,
            "limit": limit
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}
