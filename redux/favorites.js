import * as ActionTypes from './ActionTypes'

//Initialized to an empty array if it does not exist yet
//Also passed in an action that will be checked by a switch statement for the action type
export const favorites = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITE:
            //This says if the campsite id already exists in the array, then return state
            if(state.includes(action.payload)) {
                return state;
            }
            //Adds the new item of the array to the end of it and makes a copy of the array without mutating it
            return state.concat(action.payload)

        case ActionTypes.DELETE_FAVORITE:
            //Creates a new array into the favorites state by Filtering through the array. Every campsite that does not match the campsiteId in the action payload
            //Creates a new array that no longer contains the favorite we are deleting
            return state.filter(favorite => favorite !== action.payload); //??

            default:
                return state;
    }
}