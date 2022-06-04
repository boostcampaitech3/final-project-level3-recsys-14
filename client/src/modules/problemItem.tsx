const TOGGLE = 'problemItem/TOGGLE' as const;
const INITIAL ='problemItem/INITIAL' as const;

export const itemToggle = (item : any) => ({
    type : TOGGLE,
    payload : item
});
export const initialProblem = () => ({
    type : INITIAL
});

type problemItemAction = | ReturnType<typeof itemToggle> | ReturnType<typeof initialProblem>;

export type problemItemState = {
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

const initialState : problemItemState = {
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

function problemItem(state: problemItemState = initialState,
    action:problemItemAction) : problemItemState {
        switch(action.type){
            case TOGGLE:
                if (state.item === action.payload){
                    return {...state, toggle : !state.toggle, item : action.payload}
                }
                else{
                    return {...state, toggle : true, item : action.payload}
                }
                // return {...state, toggle : !state.toggle, item : action.payload}
            case INITIAL:
                return {...state, toggle : initialState.toggle, item : initialState.item};
            default:
                return state;
        }
}

export default problemItem;