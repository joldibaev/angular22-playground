import { Component, computed, input, linkedSignal } from '@angular/core';
import { UiIcon } from '../ui-icon/ui-icon';

export type UiAvatarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-avatar',
  imports: [UiIcon],
  templateUrl: './ui-avatar.html',
  styleUrl: './ui-avatar.css',
  host: {
    '[class.ui-avatar-sm]': "size() === 'sm'",
    '[class.ui-avatar-md]': "size() === 'md'",
    '[class.ui-avatar-lg]': "size() === 'lg'",
    // The host carries image semantics only when the caller supplies a name.
    // Anonymous placeholders are decoration and stay out of the accessibility tree.
    '[attr.role]': 'accessibleName() ? "img" : null',
    '[attr.aria-label]': 'accessibleName() || null',
    '[attr.aria-hidden]': 'accessibleName() ? null : "true"',
  },
})
export class UiAvatar {
  readonly src = input('');
  readonly name = input('');
  readonly size = input<UiAvatarSize>('md');

  protected readonly accessibleName = computed(() => this.name().trim());

  // Resets to `false` whenever `src` changes, so a new image gets a fresh attempt
  // after a previous one failed to load.
  protected readonly failed = linkedSignal<boolean>(() => {
    this.src();
    return false;
  });

  protected readonly showImage = computed(() => this.src().trim().length > 0 && !this.failed());

  protected readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);

    if (!parts.length) {
      return '';
    }

    const first = parts[0][0] ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';

    return (first + last).toUpperCase();
  });

  protected iconSize(): number {
    if (this.size() === 'sm') {
      return 14;
    }

    if (this.size() === 'lg') {
      return 24;
    }

    return 18;
  }

  protected onError(): void {
    this.failed.set(true);
  }
}
