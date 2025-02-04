import {inject, Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {AuthenticationResponse, UserResponse} from '../common/models'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient)

  login(username: string, password: string): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      '/users/access-token',
      {
        username,
        password,
      },
    )
  }

  register(username: string, password: string): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      '/users/register',
      {
        username,
        password,
      },
    )
  }

  me(): Observable<UserResponse> {
    return this.http.get<UserResponse>('/users/me')
  }
}
