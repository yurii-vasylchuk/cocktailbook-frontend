import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import {Store} from '@ngrx/store'
import {AuthenticationActions, AuthenticationFeature} from '../../authentication.state'
import {toSignal} from '@angular/core/rxjs-interop'
import {RouterLink} from '@angular/router'

type LoginForm = FormGroup<{
  username: FormControl<string | null>,
  password: FormControl<string | null>,
}>

@Component({
  selector: 'cb-login-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {

  #fb = inject(FormBuilder)
  protected loginForm: LoginForm = this.#fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })
  #store = inject(Store)
  protected isLoading = toSignal(this.#store.select(AuthenticationFeature.isLoading))
  protected isError = toSignal(this.#store.select(AuthenticationFeature.isErrored))

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
