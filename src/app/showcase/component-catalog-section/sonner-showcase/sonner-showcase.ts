import { Component } from '@angular/core';
import { UiButton } from '../../../components/ui-button/ui-button';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { toast } from '../../../components/ui-sonner/ui-sonner.state';
import { UiSonner } from '../../../components/ui-sonner/ui-sonner';

@Component({
  selector: 'app-sonner-showcase',
  imports: [UiButton, UiIcon, UiSonner],
  templateUrl: './sonner-showcase.html',
  styleUrl: './sonner-showcase.css',
})
export class SonnerShowcase {
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

  protected showAction(): void {
    toast('Draft order queued', {
      description: 'You can undo it before submission.',
      action: {
        label: 'Undo',
        onClick: () => toast.info('Draft restored'),
      },
      cancel: {
        label: 'Ignore',
      },
    });
  }

  protected showPromise(): void {
    toast.promise(new Promise((resolve) => setTimeout(() => resolve('Done'), 900)), {
      loading: 'Submitting order',
      success: () => 'Order accepted',
      error: 'Order failed',
    });
  }
}
