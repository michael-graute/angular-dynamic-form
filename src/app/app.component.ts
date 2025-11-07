import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ModalComponent} from "./helpers/modal/modal.component";
import {ThemeSwitcherComponent} from "./shared/components/theme-switcher/theme-switcher.component";


@Component({
  selector: 'fg-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ModalComponent, ThemeSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'form-generator';
}
