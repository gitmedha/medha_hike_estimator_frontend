import api from "../../../apis";


export const fetchAllIncrements = async(offset,limit,sortBy='employee_id',sortOrder='asc')=>{
    try{
        const response = await api.get(`/api/increments/get-increment-data/${limit}/${offset}/${sortBy}/${sortOrder}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const fetchIncrement = async(incrementId,review_cycle) => {
    try{
        const response = await api.get(`/api/increments/get-increment-data/${incrementId}/${review_cycle}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const createIncrement = async(incrementData) => {
    try{
        const response = await api.post(`/api/increments/create-increment-data`, incrementData);
        console.log(response)
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

export const getHistoricsData = async (fullName)=>{
    try{
        const response = await api.post(`/api/increments/get_historical_data_increment`, {
            "employeeName": `${fullName}`
        });

        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const getIncrementDataByReviewCycle = async (employeeId,reviewCycle)=>{
    try{
        const response = await api.get(`/api/increments/get_increment_by_review_cycle/${employeeId}/${reviewCycle}`);
        return response.data;
    }
    catch(error){
        console.log(error);
        if(error.response){
            throw new Error(error.response.data.message);
        }
        else {
            throw new Error(error.message);
        }
    }
}

export const calculateBulkNormalizeRating = async()=>{
    try{
        const response = await api.get('/api/increments/calculate_bulk_normalized_rating');
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const downloadTableExcel  = async ()=>{
    try{
        const response = await api.get('/api/increments/download_excel',{
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'increment_details.xlsx';
        link.click();

        URL.revokeObjectURL(link.href);
    }catch(error){
        console.error(error);
    }
}

export const bulkIncrement = async ()=>{
    try{
        const response = await api.get('/api/increments/calculate_bulk_increment');
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const bulkWeightedIncrement = async ()=>{
    try{
        const response = await api.get('/api/increments/calculate_bulk_weighted_increment');
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const weightedIncrement = async(employeeId,reviewCycle)=>{
    try{
        const response = await api.post('/api/increments/get_weighted_increment', {
            "employeeId": employeeId,
            "reviewCycle": reviewCycle
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const getReviewCycles = async(id)=>{
    try{
        const response = await api.get(`/api/increments/review-cycle-dropdowns/${id}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}