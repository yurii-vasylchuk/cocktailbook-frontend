import {HttpInterceptorFn} from '@angular/common/http'
import {environment} from '../common/environment'

export const apiServerInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.match('[a-zA-Z]+:\/\/.+')) {
    return next(req)
  }

  return next(req.clone({
    url: `${environment.apiUrl}${req.url}`,
  }))
}
