import api from "../../../apis";
export const getEmployee = async (id)=>{
    try{
        const response = await api.get(`/api/employees//get_employee/${id}`);
        console.log(response)
        return response.data;
    }catch(error){
        console.error(error);
    }
}

