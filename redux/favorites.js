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

            default:
                return state;
    }
}