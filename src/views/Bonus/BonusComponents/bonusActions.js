import api from "../../../apis";


export const fetchAllBonuses = async (offset,limit,sortBy='employee_id',sortOrder='asc')=>{
    try{
        const response = await api.get(`/api/bonuses/get_bonuses/${limit}/${offset}/${sortBy}/${sortOrder}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const fetchSearchDropdown = async(field)=>{
    try{
        const response = await api.get(`/api/bonuses/search-dropdown/${field}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const search = async (field,value,offset,limit)=>{
    try{
        const response = await api.post(`/api/bonuses/search`, {
            "field": field,
            "value": value,
            "offset": offset,
            "limit": limit
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

export const fetchBonusDetails = async (id)=>{
    try{
        const response = await api.get(`/api/bonuses/fetch-bonus/${id}`);
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

export const calculateBulkNormalizeRating = async()=>{
    try{
        const response = await api.get('/api/bonuses/calculate_bulk_normalized_rating');
        return response.data;
    }catch(error){
        console.error(error);
    }
}