import {TestBed} from '@angular/core/testing'
import {HttpInterceptorFn} from '@angular/common/http'

import {apiServerInterceptor} from './api-server.interceptor'

describe('apiServerInterceptorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => apiServerInterceptor(req, next))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(interceptor).toBeTruthy()
  })
})
