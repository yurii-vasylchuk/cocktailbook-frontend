import {createActionGroup, createFeature, createReducer, createSelector, on, props} from '@ngrx/store'
import {Actions, createEffect, FunctionalEffect, ofType} from '@ngrx/effects'
import {inject} from '@angular/core'
import {UserService} from '../../service/user.service'
import {catchError, exhaustMap, map, of} from 'rxjs'


import {AppActions} from '../../app.state'

export type AuthenticationState = {
  pageState: 'READY' | 'LOADING' | 'ERROR'
  errorMsg: string | null
};

const initialState: AuthenticationState = {
  pageState: 'LOADING',
  errorMsg: null,
}

export const AuthenticationActions = createActionGroup({
  source: 'Authentication Page',
  events: {
    login: props<{ username: string, password: string }>(),
    loginSucceeded: props<{ accessToken: string }>(),
    loginFailed: props<{ message: string }>(),

    register: props<{ username: string, password: string }>(),
    registrationSucceeded: props<{ accessToken: string }>(),
    registrationFailed: props<{ message: string }>(),
  },
})
export const AuthenticationFeature = createFeature({
  name: 'authentication',
  reducer: createReducer(
    initialState,
    on(AuthenticationActions.login, (state, {}): AuthenticationState => ({...state, pageState: 'LOADING'})),

    on(AuthenticationActions.loginSucceeded, (state): AuthenticationState => ({
      ...state,
      pageState: 'READY',
    })),

    on(AuthenticationActions.loginFailed, (state, {message}): AuthenticationState => ({
      ...state,
      pageState: 'ERROR',
      errorMsg: message,
    })),

    on(AuthenticationActions.register, (state, {}): AuthenticationState => ({
      ...state,
      pageState: 'LOADING',
    })),

    on(AuthenticationActions.registrationSucceeded, (state): AuthenticationState => ({
      ...state,
      pageState: 'READY',
    })),

    on(AuthenticationActions.registrationFailed, (state, {message}): AuthenticationState => ({
      ...state,
      pageState: 'ERROR',
      errorMsg: message,
    })),

    on(AppActions.accessTokenVerificationFailed, (state): AuthenticationState => ({
      ...state,
      pageState: state.pageState == 'LOADING' ? 'READY' : state.pageState,
    })),

    on(AppActions.logout, (state): AuthenticationState => ({
      ...state,
      pageState: 'READY',
    })),
  ),
  extraSelectors: ({selectPageState}) => ({
    isLoading: createSelector(
      selectPageState,
      (pageState) => pageState === 'LOADING',
    ),
    isErrored: createSelector(
      selectPageState,
      (pageState) => pageState === 'ERROR',
    ),
  }),
})

export const authenticationEffects: Record<string, FunctionalEffect> = {
  login: createEffect((actions$ = inject(Actions), userService = inject(UserService)) => (
      actions$.pipe(
        ofType(AuthenticationActions.login),
        exhaustMap(({username, password}) => userService.login(username, password).pipe(
          map(({accessToken}) => AuthenticationActions.loginSucceeded({accessToken})),
          catchError((err) => of(AuthenticationActions.loginFailed({message: err.message ?? 'Login failed'}))),
        )),
      )
    ),
    {functional: true},
  ),

  register: createEffect((actions$ = inject(Actions), userService = inject(UserService)) => (
      actions$.pipe(
        ofType(AuthenticationActions.register),
        exhaustMap(({username, password}) => userService.register(username, password).pipe(
          map(({accessToken}) => AuthenticationActions.registrationSucceeded({accessToken})),
          catchError((err) => of(AuthenticationActions.registrationFailed({message: err.message ?? 'Registration failed'}))),
        )),
      )
    ),
    {functional: true},
  ),

  redirect: createEffect((actions$ = inject(Actions)) => (actions$.pipe(
      ofType(AuthenticationActions.loginSucceeded, AuthenticationActions.registrationSucceeded),
      map(({accessToken}) => AppActions.accessTokenObtained({accessToken})),
    )),
    {functional: true}),

  loginSucceeded: createEffect((actions$ = inject(Actions)) => (actions$.pipe(
      ofType(AuthenticationActions.loginSucceeded, AuthenticationActions.registrationSucceeded),
      map(({accessToken}) => AppActions.accessTokenLoaded({accessToken})),
    )),
    {functional: true}),

  loginFailed: createEffect((actions$ = inject(Actions)) => (actions$.pipe(
      ofType(AuthenticationActions.loginFailed, AuthenticationActions.registrationFailed),
      map(() => AppActions.accessTokenVerificationFailed()),
    )),
    {functional: true}),
}
