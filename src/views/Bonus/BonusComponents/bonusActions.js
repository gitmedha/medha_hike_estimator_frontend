import api from "../../../apis";


export const fetchAllBonuses = async (offset,limit,sortBy='employee_id',sortOrder='asc')=>{
    try{
        const response = await api.get(`/api/bonuses/get_bonuses/${limit}/${offset}/${sortBy}/${sortOrder}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const fetchSearchDropdown = async(field,reviewCycle)=>{
    try{
        const response = await api.get(`/api/bonuses/search-dropdown/${field}/${reviewCycle}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const search = async (field,value,offset,limit,reviewCycle)=>{
    try{
        const response = await api.post(`/api/bonuses/search`, {
            "field": field,
            "value": value,
            "offset": offset,
            "limit": limit,
            "reviewCycle": reviewCycle
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
};

export const getBonusPickList = async ()=>{
    try{
        const response = await api.get(`/api/bonuses/bonus-dropdowns`);
        return response.data;
    }catch(error){
        console.error(error);
    }
};

export const createBonus = async (data)=>{
    try{
        const response = await api.post(`/api/bonuses/create-bonus`, data);
        return response.data;
    }catch(error){
        console.error(error);
    }

};

export const updateBonus = async (data,id)=>{
    try{
        const response = await api.put(`/api/bonuses/update-bonus/${id}`, data);
        return response.data;
    }catch(error){
        console.error(error);
    }
 };

export const deleteBonus = async (id)=>{
    try{
        const response = await api.delete(`/api/bonuses/delete-bonus/${id}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
 };

export const fetchBonusDetails = async (id,reviewCycle)=>{
    try{
        const response = await api.get(`/api/bonuses/fetch-bonus/${id}/${reviewCycle}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
    }
};

export const getDataByReviewCycle = async(employee_id,reviewCycle)=>{
    try{
        const response = await api.get(`/api/bonuses/get_data_by_review_cycle/${employee_id}/${reviewCycle}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const getNormalizedRating = async (employeeId,reviewCycle,ratings,reviewer)=>{
    try{
        const response = await api.post(`/api/bonuses/get_normalized_rating`,{
            "ratings": ratings,
            "employeeId": employeeId,
            "reviewCycle": reviewCycle,
            "managerName":reviewer
        });
        return response.data;
    }catch(error){
        console.error(error);
    }

};

export const getBonus = async (employeeId,reviewCycle,normalizedRating)=>{
    try{
        const response = await api.post(`/api/bonuses/calculate_bonus`, {
            "employeeId": employeeId,
            "reviewCycle": reviewCycle,
            "normalizedRating": normalizedRating
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
};

export const calculateBulkNormalizeRating = async(reviewCycle)=>{
    try{
        const response = await api.get('/api/bonuses/calculate_bulk_normalized_rating', {
            params: {
                reviewCycle: reviewCycle
            }
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const downloadTableExcel  = async (reviewCycle)=>{
    try{
        const response = await api.get(`/api/bonuses/download_excel?reviewCycle=${reviewCycle}`,{
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'bonus_details.xlsx';
        link.click();

        URL.revokeObjectURL(link.href);
    }catch(error){
        console.error(error);
    }
}

export const bulkBonus = async (reviewCycle)=>{
    try{
        const response = await api.get('/api/bonuses/calculate_bulk_bonus', {
            params: {
                reviewCycle: reviewCycle
            }
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const WeightedBonus = async (reviewCycle)=>{
    try{
        const response = await api.post('/api/bonuses/calculate_bulk_weighted_bonus', {
            "reviewCycle": reviewCycle
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const calculateWeightedBonus = async (employeeId,reviewCycle)=>{
    try{
        const response = await api.post(`/api/bonuses/get_weighted_bonus`, {
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
        const response = await api.get(`/api/bonuses/review-cycle-dropdowns/${id}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const getAllReviewCycles = async()=>{
    try{
        const response = await api.get(`/api/bonuses/get_review_cycles`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const fetchBonusesByReview = async(pageSize,pageIndex,sortBy,sortOrder,reviewCycle)=>{
    try{
        const {data} = await api.get('/api/bonuses/get_bonuses_by_review', {
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

