import {HttpInterceptorFn} from '@angular/common/http'
import {inject} from '@angular/core'
import {Store} from '@ngrx/store'
import {appFeature} from '../app.state'
import {mergeMap, take} from 'rxjs'

export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {
  let store = inject(Store)
  return store.select(appFeature.selectAccessToken).pipe(
    take(1),
    mergeMap(jwt => {
      if (jwt == null) {
        return next(req)
      }

      return next(req.clone({
        headers: req.headers.append('Authorization', `Bearer ${jwt}`),
      }))
    }),
  )
}
