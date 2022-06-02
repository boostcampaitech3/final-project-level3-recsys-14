const TOGGLE = 'rivalProblemItem/TOGGLE' as const;

export const rivalProblemToggle = (item : any) => ({
    type : TOGGLE,
    payload : item
})

type rivalProblemItemAction = | ReturnType<typeof rivalProblemToggle>;

export type rivalProblemItemState = {
    toggle : boolean,
    item : {
    problem_id : number,
    title: string,
    tags: Array<string>,
    accepted_user_count : number,
    level: number,
    average_tries: number
    }
}

const initialState : rivalProblemItemState = {
    toggle : false,
    item : {
    problem_id : 0,
    title: "",
    tags: [],
    accepted_user_count : 0,
    level: 0,
    average_tries: 0
    }
};

function rivalProblemItem(state: rivalProblemItemState = initialState,
    action:rivalProblemItemAction) : rivalProblemItemState {
        switch(action.type){
            case TOGGLE:
                if (state.item === action.payload){
                    return {...state, toggle : !state.toggle, item : action.payload}
                }
                else{
                    return {...state, toggle : true, item : action.payload}
                }
                // return {...state, toggle : !state.toggle, item : action.payload}
            default:
                return state;
        }
}

export default rivalProblemItem;