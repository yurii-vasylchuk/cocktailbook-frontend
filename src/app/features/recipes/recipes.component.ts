import {ChangeDetectionStrategy, Component} from '@angular/core'

@Component({
  selector: 'cb-recipes',
  imports: [],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent {

}
