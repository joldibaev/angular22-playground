import { Component } from '@angular/core';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiButton } from '../../../components/ui-button/ui-button';

@Component({
  selector: 'app-button-showcase',
  imports: [UiButton, UiIcon],
  templateUrl: './button-showcase.html',
  styleUrl: './button-showcase.css',
})
export class ButtonShowcase {}
