import { Component, signal } from '@angular/core';
import { UiAlert } from '../../../components/ui-alert/ui-alert';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-alert-showcase',
  imports: [UiAlert, UiButton, UiCard, UiTab, UiTabItem],
  templateUrl: './alert-showcase.html',
  styleUrl: './alert-showcase.css',
})
export class AlertShowcase {
  protected readonly withUrgentError = signal(false);

  protected readonly defaultCode = `import { UiAlert } from './components/ui-alert/ui-alert';

<ui-alert title="Market session">
  Trading closes today at 17:00.
</ui-alert>`;
  protected readonly destructiveCode = `<ui-alert title="Order rejected" variant="destructive">
  The entered quantity exceeds the available balance.
</ui-alert>`;
  protected readonly actionCode = `<ui-alert title="Profile incomplete">
  Add a recovery email before enabling withdrawals.
  <button uiButton uiAlertAction type="button" variant="outline" size="sm">
    Add email
  </button>
</ui-alert>`;
  protected readonly liveCode = `@if (withUrgentError()) {
  <ui-alert title="Connection lost" variant="destructive" role="alert">
    Live prices are unavailable. Reconnect before submitting an order.
  </ui-alert>
}`;
}
