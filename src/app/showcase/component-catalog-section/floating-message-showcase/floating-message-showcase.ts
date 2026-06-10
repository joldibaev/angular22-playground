import { Component, signal } from '@angular/core';
import { UiFloatingMessage } from '../../../components/ui-floating-message/ui-floating-message';

@Component({
  selector: 'app-floating-message-showcase',
  imports: [UiFloatingMessage],
  templateUrl: './floating-message-showcase.html',
})
export class FloatingMessageShowcase {
  readonly messageOpen = signal(true);
}
