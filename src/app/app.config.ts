import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core'
import {provideRouter, withComponentInputBinding} from '@angular/router'

import {routes} from './app.routes'
import {provideState, provideStore} from '@ngrx/store'
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http'
import {authorizationInterceptor} from './infra/authorization.interceptor'
import {provideEffects} from '@ngrx/effects'
import {appEffects, appFeature} from './app.state'
import {apiServerInterceptor} from './infra/api-server.interceptor'
import {provideStoreDevtools} from '@ngrx/store-devtools'
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import {authenticationEffects, AuthenticationFeature} from './features/authentication/authentication.state'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withComponentInputBinding()),
    provideStore(),
    provideState(appFeature),
    provideState(AuthenticationFeature),
    provideHttpClient(withFetch(), withInterceptors([
      apiServerInterceptor,
      authorizationInterceptor,
    ])),
    provideEffects(appEffects),
    provideEffects(authenticationEffects),
    provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()}),
    provideAnimationsAsync(),
  ],
}
