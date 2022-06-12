const TOGGLE_SWITCH = 'tagSwitch/SWITCH_TOGGLE';

export const toggleSwitch = () => ({
    type : TOGGLE_SWITCH
});

type tagswitchAction = | ReturnType<typeof toggleSwitch>;

export type tagswitchState = {
    toggle : boolean
};

const initialState : tagswitchState = {
    toggle : false
};

function tagSwitch(state : tagswitchState = initialState,
    action : tagswitchAction) : tagswitchState {
        switch(action.type){
            case TOGGLE_SWITCH:
                return {...state, toggle : !state.toggle}
            default:
                return state;
        }
}

export default tagSwitch;