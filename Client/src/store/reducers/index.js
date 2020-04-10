import Reducer1 from './reducer1';
import UserReducer from './user_reducer';
import AuthReducer from './auth_reducer';
import PostsReducer from './post_reducer';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    reducer1: Reducer1,
    user_reducer: UserReducer,
    auth_reducer: AuthReducer,
    posts_reducer:PostsReducer
})

export default rootReducer;
