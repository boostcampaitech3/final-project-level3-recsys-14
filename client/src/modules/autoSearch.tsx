
const AUTO_SEARCH = 'autoSearch/AUTO_SEARCH' as const;
const INITIAL = 'autoSearch/INITIAL' as const;

export const autoUserSearch = (handles : Array<any>) =>({
    type : AUTO_SEARCH,
    payload : handles
})
export const autoUserInitial = () => ({
    type : INITIAL
})

type autoSearchAction = | ReturnType<typeof autoUserSearch> | ReturnType<typeof autoUserInitial>;

export type autoSearchState = {
    handles : Array<any>
}
const initialState : autoSearchState = {
    handles : []
}
// {
//     handle : '',
//     solved_count : 0,
//     user_class : 0,
//     tier : 0,
//     rating : 0,
//     rating_by_problems_sum : 0,
//     rating_by_class : 0,
//     rating_by_solved_count : 0,
//     exp : 0,
//     rival_count : 0,
//     reverse_rival_count : 0,
//     max_streak : 0,
//     rank : 0,
//     organization : ''
// }
function autoSearch(state : autoSearchState = initialState,
    action : autoSearchAction) : autoSearchState {
        switch(action.type){
            case AUTO_SEARCH:
                return {...state, handles : action.payload};
            case INITIAL:
                return {...state, handles : initialState.handles}
            default:
                return state;
        }
}

export default autoSearch;