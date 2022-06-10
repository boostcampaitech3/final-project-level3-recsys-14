const CLOSE = 'alertClose/CLOSE';

export const clickClose = () => ({
    type : CLOSE
});

type alertCloseAction = | ReturnType<typeof clickClose>;

export type alertCloseState = {
    toggle : boolean
};

const initialState : alertCloseState = {
    toggle : true
};

function alertClose(state : alertCloseState = initialState,
    action : alertCloseAction) : alertCloseState {
        switch(action.type){
            case CLOSE:
                return {...state, toggle : !state.toggle}
            default:
                return state;
        }
}

export default alertClose;