import {Component, inject} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {NavigationComponent} from './components/navigation/navigation.component'
import {Store} from '@ngrx/store'
import {AppActions, appFeature} from './app.state'
import {AsyncPipe} from '@angular/common'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  #store = inject(Store)
  protected authStatus$ = this.#store.select(appFeature.selectAuthStatus)

  handleLogout() {
    this.#store.dispatch(AppActions.logout())
  }
}
