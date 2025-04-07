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

export const searchHistorics = async (searchField,searchValue,paginationPageSize=25,paginationPageIndex=0) => {
    try {
        const body = { searchField,searchValue, limit:paginationPageSize,page:paginationPageIndex };
                
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

export const getReportee = async (name)=>{
    try{
        const response = await api.get(`/api/historical_data/get_reportee_details/${name}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}


export const createHistoric = async (historical_data)=>{
    try{
        const response = await api.post(`/api/historical_data/create_historical_data`, historical_data, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    }catch(error){
        console.error(error);
    }

}

export const updateHistoric = async (historical_data,id)=>{
    try{
        const response = await api.put(`/api/historical_data/edit_historical_data/${id}`, historical_data, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    }catch(error){
        console.error(error);
    }
}

export const deleteHistoric = async (id)=>{
    try{
        const response = await api.delete(`/api/historical_data/delete_historical_data/${id}`);
        return response.data;
    }catch(error){
        console.error(error);
    }
}


export const downloadTableExcel  = async ()=>{
    try{
        const response = await api.get('/api/historical_data/download_excel',{
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'historical_data.xlsx';
        link.click();

        URL.revokeObjectURL(link.href);
    }catch(error){
        console.error(error);
    }
}
