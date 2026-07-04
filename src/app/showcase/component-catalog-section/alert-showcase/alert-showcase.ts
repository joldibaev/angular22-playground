import { Component } from '@angular/core';
import { UiAlert } from '../../../components/ui-alert/ui-alert';
import { UiButton } from '../../../components/ui-button/ui-button';

@Component({
  selector: 'app-alert-showcase',
  imports: [UiAlert, UiButton],
  templateUrl: './alert-showcase.html',
})
export class AlertShowcase {}
