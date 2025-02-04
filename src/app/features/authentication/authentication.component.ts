import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import {Store} from '@ngrx/store'
import {AuthenticationActions, AuthenticationFeature, AuthenticationState} from './authentication.state'
import {Observable} from 'rxjs'
import {RouterOutlet} from '@angular/router'

type LoginForm = FormGroup<{
  username: FormControl<string | null>,
  password: FormControl<string | null>,
}>

@Component({
  selector: 'cb-authentication',
  imports: [ReactiveFormsModule, RouterOutlet],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AuthenticationComponent {
  #fb = inject(FormBuilder)
  protected loginForm: LoginForm = this.#fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })
  #store = inject(Store)
  protected state$: Observable<AuthenticationState['pageState']> = this.#store.select(AuthenticationFeature.selectPageState)

  onLogin() {
    if (this.loginForm.invalid) {
      return
    }

    const {username, password} = this.loginForm.value

    this.#store.dispatch(AuthenticationActions.login({
      username: username as string,
      password: password as string,
    }))
  }
}
