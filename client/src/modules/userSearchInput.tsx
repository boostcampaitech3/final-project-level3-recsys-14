const SEARCH = 'userSearchInput/SEARCH' as const;

export const search = (userHandle:string | undefined) => ({
    type : SEARCH,
    payload : userHandle
})

type userSearchInputAction = | ReturnType<typeof search>;

export type userSearchInputState = {
    userHandle : string | undefined;
}

const initialState :userSearchInputState = {
    userHandle : ''
};

function userSearchInput(state: userSearchInputState = initialState,
    action : userSearchInputAction) : userSearchInputState {
        switch(action.type){
            case SEARCH:
                return {...state, userHandle : action.payload};
            default:
                return state;
        }
}

export default userSearchInput;