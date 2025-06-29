import { expect, test, jest } from '@jest/globals';
import { rootReducer, store } from './store';

test('Проверка инициализации корневого редьюсера', () => {
    const initialState = store.getState()
    const action = {type: 'anyAction'}
    const stateAfterAction = rootReducer(undefined, action)
    expect(stateAfterAction).toEqual(initialState)
})