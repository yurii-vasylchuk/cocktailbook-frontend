import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import {RouterLink} from '@angular/router'
import {Store} from '@ngrx/store'
import {toSignal} from '@angular/core/rxjs-interop'
import {AuthenticationActions, AuthenticationFeature} from '../../authentication.state'

type RegistrationForm = FormGroup<{
  username: FormControl<string | null>,
  password: FormControl<string | null>,
}>

@Component({
  selector: 'cb-registration-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationFormComponent {
  #fb = inject(FormBuilder)
  protected loginForm: RegistrationForm = this.#fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })
  #store = inject(Store)
  protected isLoading = toSignal(this.#store.select(AuthenticationFeature.isLoading))
  protected isError = toSignal(this.#store.select(AuthenticationFeature.isErrored))

  onRegister() {
    if (this.loginForm.invalid) {
      return
    }

    const {username, password} = this.loginForm.value

    this.#store.dispatch(AuthenticationActions.register({
      username: username as string,
      password: password as string,
    }))
  }
}
