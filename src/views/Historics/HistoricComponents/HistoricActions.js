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