import { Component, inject, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiSelect } from '../../../components/ui-select/ui-select';
import { UiSelectOption } from '../../../components/ui-select/ui-select-option/ui-select-option';
import { SonnerService } from '../../../components/ui-sonner/sonner.service';
import { UiSonner } from '../../../components/ui-sonner/ui-sonner';
import type { UiSonnerPosition } from '../../../components/ui-sonner/ui-sonner.type';
import { UiSwitch } from '../../../components/ui-switch/ui-switch';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

const POSITIONS: ReadonlyArray<{ value: UiSonnerPosition; label: string }> = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-center', label: 'Top center' },
  { value: 'top-right', label: 'Top right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-center', label: 'Bottom center' },
  { value: 'bottom-right', label: 'Bottom right' },
];

@Component({
  selector: 'app-sonner-showcase',
  imports: [UiButton, UiCard, UiSelect, UiSelectOption, UiSonner, UiSwitch, UiTab, UiTabItem],
  templateUrl: './sonner-showcase.html',
  styleUrl: './sonner-showcase.css',
})
export class SonnerShowcase {
  private readonly sonner = inject(SonnerService);
  protected readonly positions = POSITIONS;
  protected readonly selectedPosition = signal<UiSonnerPosition>('bottom-right');
  protected readonly expanded = signal(false);
  protected readonly visibleToasts = signal(3);

  protected readonly defaultCode = `import { inject } from '@angular/core';
import { SonnerService } from './components/ui-sonner/sonner.service';

readonly sonner = inject(SonnerService);

this.sonner.show('Price alert created', {
  description: 'AAPL above $220.',
});`;

  protected readonly typesCode = `this.sonner.success('Portfolio synced');
this.sonner.info('Market data refreshed');
this.sonner.warning('Price limit near');
this.sonner.error('Order rejected');`;

  protected readonly promiseCode = `this.sonner.promise(placeOrder(), {
  loading: 'Submitting order',
  success: (order) => \`Order #\${order.id} accepted\`,
  error: (error) => getMessage(error),
  finally: () => releaseOrderLock(),
});`;

  protected readonly updateCode = `const id = this.sonner.loading('Saving watchlist', undefined, {
  id: 'watchlist-save',
});

this.sonner.success('Watchlist saved', undefined, { id });
this.sonner.dismiss(id);`;

  protected readonly actionCode = `this.sonner.show('Draft order queued', {
  description: 'You can undo it before submission.',
  action: { label: 'Undo', onClick: restoreDraft },
  cancel: { label: 'Ignore' },
});`;

  protected readonly iconCode = `this.sonner.show('Market opened', {
  icon: 'outline-bell-down',
});`;

  protected readonly positionCode = `this.sonner.success('Account synced', undefined, {
  position: 'top-left',
});`;

  protected readonly behaviorCode = `this.sonner.info('Live monitoring enabled', undefined, {
  duration: Number.POSITIVE_INFINITY,
});

this.sonner.info('Read-only system notice', undefined, {
  dismissible: false,
});

this.sonner.warning('Margin level critical', undefined, {
  important: true,
});

this.sonner.show('Lifecycle callbacks', {
  onAutoClose: handleAutoClose,
  onDismiss: handleDismiss,
});`;

  protected readonly stackCode = `this.sonner.info('Market connected');
this.sonner.success('Watchlist synced');
this.sonner.warning('Volatility increased');

this.sonner.dismiss();`;

  protected readonly toasterCode = `<ui-sonner
  position="bottom-right"
  [visibleToasts]="3"
  [expand]="false"
  [gap]="14"
  offset="32px"
  [hotKey]="['altKey', 'KeyT']"
  [toastOptions]="{ duration: 5000 }"
  closeButton
  closeLabel="Dismiss notification"
  label="Notifications"
/>`;

  protected setVisibleToasts(value: string): void {
    this.visibleToasts.set(Number(value));
  }

  protected showDefault(): void {
    this.sonner.show('Price alert created', { description: 'AAPL above $220.' });
  }

  protected showSuccess(): void {
    this.sonner.success('Portfolio synced', 'Latest positions are now reflected.');
  }

  protected showInfo(): void {
    this.sonner.info('Market data refreshed', 'Quotes updated from the live feed.');
  }

  protected showWarning(): void {
    this.sonner.warning('Price limit near', undefined, {
      description: 'Review the order before it reaches the guardrail.',
    });
  }

  protected showDestructive(): void {
    this.sonner.error('Order rejected', undefined, {
      description: 'The broker returned an invalid quantity response.',
    });
  }

  protected showPromise(): void {
    this.sonner.promise(new Promise((resolve) => setTimeout(() => resolve('Done'), 900)), {
      loading: 'Submitting order',
      success: () => 'Order accepted',
      error: 'Order failed',
    });
  }

  protected showUpdate(): void {
    this.sonner.loading('Saving watchlist', undefined, { id: 'watchlist-save' });
    setTimeout(() => {
      this.sonner.success('Watchlist saved', undefined, {
        id: 'watchlist-save',
        description: 'The same toast was updated in place.',
      });
    }, 900);
  }

  protected showAction(): void {
    this.sonner.show('Draft order queued', {
      description: 'You can undo it before submission.',
      action: { label: 'Undo', onClick: () => this.sonner.info('Draft restored') },
      cancel: { label: 'Ignore' },
    });
  }

  protected showCustomIcon(): void {
    this.sonner.show('Market opened', { icon: 'outline-bell-down' });
  }

  protected showPosition(position: UiSonnerPosition): void {
    this.sonner.success(`Toast at ${position.replace('-', ' ')}`, undefined, { position });
  }

  protected showPersistent(): void {
    this.sonner.info('Live monitoring enabled', undefined, {
      description: 'This notification stays until dismissed.',
      duration: Number.POSITIVE_INFINITY,
    });
  }

  protected showImportant(): void {
    this.sonner.warning('Margin level critical', undefined, {
      important: true,
      description: 'Announced through an assertive live region.',
    });
  }

  protected showNonDismissible(): void {
    this.sonner.info('Read-only system notice', undefined, {
      dismissible: false,
      description: 'Manual dismissal is disabled.',
      duration: 6000,
    });
  }

  protected showLifecycle(): void {
    this.sonner.show('Lifecycle callbacks attached', {
      duration: 5000,
      onDismiss: () => this.sonner.info('onDismiss fired'),
      onAutoClose: () => this.sonner.info('onAutoClose fired'),
    });
  }

  protected showStack(): void {
    this.sonner.info('Market connected');
    this.sonner.success('Watchlist synced');
    this.sonner.warning('Volatility increased');
    this.sonner.show('Background task ready');
  }

  protected showMultiplePositions(): void {
    this.sonner.success('Primary account synced', undefined, { position: 'bottom-right' });
    this.sonner.info('Secondary account connected', undefined, { position: 'top-left' });
  }

  protected dismissAll(): void {
    this.sonner.dismiss();
  }
}
