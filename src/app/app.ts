import { Component } from '@angular/core';
import { UiSelect } from './ui-select/ui-select';
import { UiSelectOption } from './ui-select/ui-select-option/ui-select-option';

@Component({
  selector: 'app-root',
  imports: [UiSelect, UiSelectOption],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
