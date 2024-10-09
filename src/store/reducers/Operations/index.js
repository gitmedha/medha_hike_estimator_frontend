import {SEARCH_OPS,RESET_SEARCH,SORT_DATA,NO_RESULT_FOUND} from './types';

const INIT_STATE = {
    data:[],
    isSorting:false,
    isFound:false,
    isSearching:false,
}

const Operations = (state = INIT_STATE, {type,payload}) =>{
    
    switch(type){
        case SEARCH_OPS:
            return {
                ...state,
                data: [...payload],
                isFound: true,
                isSearching:true,
                
            };
        case RESET_SEARCH:
            return {
                data: [],
                isSearching:false
            }
        case SORT_DATA:
            return {
                ...state,
                data:[...payload],
                isSorting:true
            }
        case NO_RESULT_FOUND:
            return  {
                data: [...payload],
                isFound:false,
                isSearching:true
            }
        default:
            break;
    };
   
    return state;
}

export default Operations;