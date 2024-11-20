import api from "../../../apis";

export const getHistoric = async (id) =>{
    try{
        const response = await api.get(`/api/historical_data/get_historic/${id}`);
        console.log(response)
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const searchHistorics = async (searchValue, from = null, to = null,paginationPageSize=25,paginationPageIndex=0) => {
    try {
        const body = { searchValue, limit:paginationPageSize,page:paginationPageIndex };
        if (from && to) {
            body.from = from;
            body.to = to;
        }
                
        const response = await api.post('/api/historical_data/search_historics', body, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        return response.data;
    } catch (error) {
        console.error(error);
    }
};


export const LoadSearchPicklist = async (dropDownField) => {
    try{
        const response = await api.get(`/api/historical_data/search_picklist/${dropDownField}`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const getHistoricPickList = async ()=>{
    try{
        const response = await api.get(`/api/historical_data/get_historic_picklist`);
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error);
    }
}