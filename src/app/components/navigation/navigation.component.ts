import {ChangeDetectionStrategy, Component, output} from '@angular/core'
import {RouterLink} from '@angular/router'

@Component({
  selector: 'cb-navigation',
  imports: [
    RouterLink,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  logout = output<void>()
}
