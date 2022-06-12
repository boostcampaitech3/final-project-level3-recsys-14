const TOGGLE = 'rivalItem/TOGGLE' as const;
const INITIAL = 'rivalItem/INITIAL' as const;

export const rivalToggle = (rival:any) => ({
    type : TOGGLE,
    payload : rival
});
export const initialRival = () =>({
    type : INITIAL
})

type rivalItemAction = | ReturnType<typeof rivalToggle> | ReturnType<typeof initialRival>;

export type rivalItemState = {
    toggle : boolean,
    rival : {
        handle : string,
        solved_count : number,
        user_class : number,
        tier : number,
        rating : number,
        rating_by_problems_sum : number,
        rating_by_class : number,
        rating_by_solved_count : number,
        exp : number,
        rival_count : number,
        reverse_rival_count : number,
        max_streak : number,
        rank : number,
        organization : string
    }
}
const initialState : rivalItemState = {
    toggle : false,
    rival : {
        handle : '',
        solved_count : 0,
        user_class : 0,
        tier : 0,
        rating : 0,
        rating_by_problems_sum : 0,
        rating_by_class : 0,
        rating_by_solved_count : 0,
        exp : 0,
        rival_count : 0,
        reverse_rival_count : 0,
        max_streak : 0,
        rank : 0,
        organization : ''
    }
}
function rivalItem(state : rivalItemState = initialState,
    action : rivalItemAction) : rivalItemState {
        switch(action.type){
            case TOGGLE:
                if(state.rival === action.payload){
                    return {...state, toggle : !state.toggle, rival : action.payload}
                }
                else{
                    return {...state, toggle : true, rival : action.payload}
                }
            case INITIAL:
                return {...state, toggle : initialState.toggle, rival : initialState.rival}
            default:
                return state;
        }
}

export default rivalItem;