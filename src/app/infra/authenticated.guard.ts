import {CanActivateFn, Router} from '@angular/router'
import {inject} from '@angular/core'
import {appFeature} from '../app.state'
import {Store} from '@ngrx/store'
import {map, take, tap} from 'rxjs'

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  return inject(Store).select(appFeature.selectAuthStatus).pipe(
    take(1),
    map(status => status === 'AUTHENTICATED'),
    tap(result => {
      if (!result) {
        router.navigate(['auth', 'login']).catch(err => console.error(err))
      }
    }),
  )
}
