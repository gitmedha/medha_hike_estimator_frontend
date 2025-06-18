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

export const applyFilterActions = async(filterData,offset,limit,reviewCycle)=>{
    try{
        const response = await api.post(`/api/increments/add-filter-increment-data/${offset}/${limit}`, 
            {"fields":filterData[0].fields,
            "values":filterData[0].values,
            "reviewCycle":reviewCycle
            });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const fetchSearchDropdown = async(field,reviewCycle)=>{
    try{
        const response = await api.get(`/api/increments/search-dropdowns/${field}/${reviewCycle}`);
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

export const search = async(field,value,limit,page, reviewCycle)=>{
    try{
        const response = await api.post(`/api/increments/search-increment-data`, {
            "field": field,
            "value": value,
            "offset": page,
            "limit": limit,
            "reviewCycle": reviewCycle
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const getHistoricsData = async (fullName,sortBy="reviewer",sortOrder="asc")=>{
    try{
        const response = await api.post(`/api/increments/get_historical_data_increment`, {
            "employeeName": `${fullName}`,
            "sortBy": sortBy,
            "sortOrder": sortOrder
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

export const calculateBulkNormalizeRating = async(reviewCycle)=>{
    try{
        const response = await api.get('/api/increments/calculate_bulk_normalized_rating?reviewCycle='+reviewCycle);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const downloadTableExcel  = async (reviewCycle)=>{
    try{
        const response = await api.get(`/api/increments/download_excel?reviewCycle=${reviewCycle}`,{
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

export const bulkIncrement = async (reviewCycle)=>{
    try{
        const response = await api.get(`/api/increments/calculate_bulk_increment?reviewCycle=${reviewCycle}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const bulkWeightedIncrement = async (reviewCycle)=>{
    try{
        const response = await api.get(`/api/increments/calculate_bulk_weighted_increment?reviewCycle=${reviewCycle}`);
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

export const getAllReviewCycles = async ()=>{
    try{
        const response = await api.get(`/api/increments/get_all_review_cycles`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const getIncrementDataByAppraisalCycle = async(pageSize,pageIndex,sortBy,sortOrder,reviewCycle)=>{
    try{
        const {data} = await api.get(`/api/increments/get_increment_by_appraisal_cycle`,{
            params: {
                pageSize: pageSize,
                pageIndex: pageIndex,
                sortBy: sortBy,
                sortOrder: sortOrder,
                reviewCycle:reviewCycle
            }
        });
        return [data.data,data.totalCount];
    }catch(error){
        console.error(error);
    }
}


// function to move the current increment to the historical cycle
export const moveToHistoricalCycle = async (reviewCycle) => {
    try {
        const response = await api.get(`/api/increments/transfer_increment_to_historical/${reviewCycle}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}