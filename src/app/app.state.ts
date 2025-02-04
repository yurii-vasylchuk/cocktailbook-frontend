import {createActionGroup, createFeature, createReducer, emptyProps, on, props} from '@ngrx/store'
import {Actions, createEffect, FunctionalEffect, ofType, ROOT_EFFECTS_INIT} from '@ngrx/effects'
import {inject} from '@angular/core'
import {catchError, map, of, switchMap, tap} from 'rxjs'
import {UserService} from './service/user.service'
import {Router} from '@angular/router'

export type AppState = {
  userId: number | null,
  role: string | null,
  accessToken: string | null
  username: string | null
  authStatus: 'AUTHENTICATED' | 'UNKNOWN' | 'NOT_AUTHENTICATED'
};

const initialState: AppState = {
  userId: null,
  role: null,
  accessToken: null,
  username: null,
  authStatus: 'UNKNOWN',
}

export const AppActions = createActionGroup({
  source: 'Cocktail Book',
  events: {
    accessTokenLoaded: props<{ accessToken: string }>(),
    accessTokenObtained: props<{ accessToken: string }>(),
    accessTokenVerified: props<{ id: number, username: string, role: string }>(),
    accessTokenVerificationFailed: emptyProps(),
    logout: emptyProps(),
  },
})
export const appFeature = createFeature({
  name: 'cocktailbook',
  reducer: createReducer(
    initialState,

    on(AppActions.accessTokenLoaded, (state, {accessToken}): AppState => ({
      ...state,
      accessToken: accessToken,
      authStatus: 'UNKNOWN',
    })),

    on(AppActions.accessTokenObtained, (state, {accessToken}): AppState => ({
      ...state,
      accessToken: accessToken,
      authStatus: 'UNKNOWN',
    })),

    on(AppActions.accessTokenVerified, (state, {id, username, role}): AppState => ({
      ...state,
      authStatus: 'AUTHENTICATED',
      userId: id,
      username,
      role,
    })),

    on(AppActions.accessTokenVerificationFailed, (state): AppState => ({
      ...state,
      authStatus: 'NOT_AUTHENTICATED',
      username: null,
      accessToken: null,
    })),

    on(AppActions.logout, (state): AppState => ({
      ...state,
      authStatus: 'NOT_AUTHENTICATED',
      userId: null,
      username: null,
      role: null,
      accessToken: null,
    })),
  ),
})

const ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'accessToken' as const

export const appEffects: Record<string, FunctionalEffect> = {
  saveAccessToken: createEffect((actions$ = inject(Actions)) => (
      actions$.pipe(
        ofType(AppActions.accessTokenObtained),
        tap(({accessToken}) => {
          localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken)
        }),
      )
    ),
    {functional: true, dispatch: false},
  ),

  verifyAccessToken: createEffect((actions$ = inject(Actions), userService = inject(UserService), router = inject(Router)) => (
    actions$.pipe(
      ofType(AppActions.accessTokenLoaded, AppActions.accessTokenObtained),
      switchMap(() => userService.me()),
      map(user => {
        router.navigate(['home'])
        return AppActions.accessTokenVerified({...user})
      }),
      catchError(() => {
        router.navigate(['auth', 'login'])
        return of(AppActions.accessTokenVerificationFailed)
      }),
    )
  ), {functional: true}),

  checkAccessToken: createEffect((actions$ = inject(Actions)) => (
    actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)
        return accessToken == null ?
          AppActions.accessTokenVerificationFailed() :
          AppActions.accessTokenLoaded({accessToken})
      }),
    )
  ), {functional: true}),

  logout: createEffect((actions$ = inject(Actions), router = inject(Router)) => (
    actions$.pipe(
      ofType(AppActions.logout),
      map(() => {
        localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)
        router.navigate(['auth', 'login'])
      }),
    )
  ), {functional: true, dispatch: false}),
}
