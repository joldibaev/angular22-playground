import { Component, signal } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiSelect, type UiSelectValue } from '../../../components/ui-select/ui-select';
import { UiSelectOption } from '../../../components/ui-select/ui-select-option/ui-select-option';
import { toast } from '../../../components/ui-sonner/ui-sonner.state';
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
  protected readonly positions = POSITIONS;
  protected readonly selectedPosition = signal<UiSonnerPosition>('bottom-right');
  protected readonly expanded = signal(false);
  protected readonly visibleToasts = signal(3);

  protected readonly defaultCode = `import { UiSonner } from './components/ui-sonner/ui-sonner';
import { toast } from './components/ui-sonner/ui-sonner.state';

<ui-sonner position="bottom-right" closeButton />

toast('Price alert created', {
  description: 'AAPL above $220.',
});`;

  protected readonly typesCode = `toast.success('Portfolio synced');
toast.info('Market data refreshed');
toast.warning('Price limit near');
toast.error('Order rejected');`;

  protected readonly promiseCode = `toast.promise(placeOrder(), {
  loading: 'Submitting order',
  success: (order) => \`Order #\${order.id} accepted\`,
  error: (error) => getMessage(error),
  finally: () => releaseOrderLock(),
});`;

  protected readonly updateCode = `const id = toast.loading('Saving watchlist', {
  id: 'watchlist-save',
});

toast.success('Watchlist saved', { id });
toast.dismiss(id);`;

  protected readonly actionCode = `toast('Draft order queued', {
  description: 'You can undo it before submission.',
  action: { label: 'Undo', onClick: restoreDraft },
  cancel: { label: 'Ignore' },
});`;

  protected readonly iconCode = `toast('Market opened', {
  icon: 'outline-bell-down',
});`;

  protected readonly positionCode = `toast.success('Account synced', {
  position: 'top-left',
});`;

  protected readonly behaviorCode = `toast.info('Live monitoring enabled', {
  duration: Number.POSITIVE_INFINITY,
});

toast.info('Read-only system notice', {
  dismissible: false,
});

toast.warning('Margin level critical', {
  important: true,
});

toast('Lifecycle callbacks', {
  onAutoClose: handleAutoClose,
  onDismiss: handleDismiss,
});`;

  protected readonly stackCode = `toast.info('Market connected');
toast.success('Watchlist synced');
toast.warning('Volatility increased');

toast.dismiss();`;

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

  protected setVisibleToasts(value: UiSelectValue): void {
    if (typeof value === 'string') {
      this.visibleToasts.set(Number(value));
    }
  }

  protected showDefault(): void {
    toast('Price alert created', { description: 'AAPL above $220.' });
  }

  protected showSuccess(): void {
    toast.success('Portfolio synced', { description: 'Latest positions are now reflected.' });
  }

  protected showInfo(): void {
    toast.info('Market data refreshed', { description: 'Quotes updated from the live feed.' });
  }

  protected showWarning(): void {
    toast.warning('Price limit near', {
      description: 'Review the order before it reaches the guardrail.',
    });
  }

  protected showDestructive(): void {
    toast.error('Order rejected', {
      description: 'The broker returned an invalid quantity response.',
    });
  }

  protected showPromise(): void {
    toast.promise(new Promise((resolve) => setTimeout(() => resolve('Done'), 900)), {
      loading: 'Submitting order',
      success: () => 'Order accepted',
      error: 'Order failed',
    });
  }

  protected showUpdate(): void {
    toast.loading('Saving watchlist', { id: 'watchlist-save' });
    setTimeout(() => {
      toast.success('Watchlist saved', {
        id: 'watchlist-save',
        description: 'The same toast was updated in place.',
      });
    }, 900);
  }

  protected showAction(): void {
    toast('Draft order queued', {
      description: 'You can undo it before submission.',
      action: { label: 'Undo', onClick: () => toast.info('Draft restored') },
      cancel: { label: 'Ignore' },
    });
  }

  protected showCustomIcon(): void {
    toast('Market opened', { icon: 'outline-bell-down' });
  }

  protected showPosition(position: UiSonnerPosition): void {
    toast.success(`Toast at ${position.replace('-', ' ')}`, { position });
  }

  protected showPersistent(): void {
    toast.info('Live monitoring enabled', {
      description: 'This notification stays until dismissed.',
      duration: Number.POSITIVE_INFINITY,
    });
  }

  protected showImportant(): void {
    toast.warning('Margin level critical', {
      important: true,
      description: 'Announced through an assertive live region.',
    });
  }

  protected showNonDismissible(): void {
    toast.info('Read-only system notice', {
      dismissible: false,
      description: 'Manual dismissal is disabled.',
      duration: 6000,
    });
  }

  protected showLifecycle(): void {
    toast('Lifecycle callbacks attached', {
      duration: 5000,
      onDismiss: () => toast.info('onDismiss fired'),
      onAutoClose: () => toast.info('onAutoClose fired'),
    });
  }

  protected showStack(): void {
    toast.info('Market connected');
    toast.success('Watchlist synced');
    toast.warning('Volatility increased');
    toast('Background task ready');
  }

  protected showMultiplePositions(): void {
    toast.success('Primary account synced', { position: 'bottom-right' });
    toast.info('Secondary account connected', { position: 'top-left' });
  }

  protected dismissAll(): void {
    toast.dismiss();
  }
}
