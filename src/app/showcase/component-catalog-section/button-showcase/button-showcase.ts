import { ShowcaseExample } from '../showcase-example/showcase-example';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { UiButton, type UiButtonVariant } from '../../../components/ui-button/ui-button';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
@Component({
  selector: 'app-button-showcase',
  imports: [ShowcaseExample, UiButton, UiIcon],
  templateUrl: './button-showcase.html',
  styleUrl: './button-showcase.css',
})
export class ButtonShowcase {
  private readonly destroyRef = inject(DestroyRef);
  private completionTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly saving = signal(false);
  protected readonly variants: UiButtonVariant[] = [
    'default',
    'brand',
    'outline',
    'destructive',
    'secondary',
    'ghost',
    'link',
  ];
  protected readonly variantsCode = `import { type UiButtonVariant } from './components/ui-button/ui-button';

readonly variants: UiButtonVariant[] = [
  'default', 'brand', 'outline', 'destructive', 'secondary', 'ghost', 'link',
];

@for (variant of variants; track variant) {
  <button uiButton type="button" [variant]="variant">{{ variant }}</button>
}`;
  protected readonly sizesCode = `<button uiButton type="button" size="sm">Small</button>\n<button uiButton type="button">Medium</button>\n<button uiButton type="button" variant="brand" rounded>Pill</button>`;
  protected readonly statesCode = `import { signal } from '@angular/core';

readonly saving = signal(false);

save(): void {
  this.saving.set(true);
  setTimeout(() => this.saving.set(false), 2000);
}

<button uiButton type="button">Enabled</button>
<button uiButton type="button" disabled>Disabled</button>
<button
  uiButton
  type="button"
  variant="brand"
  [loading]="saving()"
  (click)="save()"
>
  Save changes
</button>`;
  protected readonly iconsCode = `<button uiButton type="button" variant="brand">
  <ui-icon slot="start" name="outline-plus" decorative />
  <span>Create</span>
</button>
<button uiButton type="button" variant="outline">
  <span>Continue</span>
  <ui-icon slot="end" name="outline-chevron-right" decorative />
</button>
<button uiButton type="button" variant="ghost" iconOnly aria-label="Settings">
  <ui-icon name="outline-settings" decorative />
</button>`;
  protected readonly anchorCode = `<a uiButton href="#component-catalog" variant="outline">Open catalog</a>\n<a uiButton href="#component-catalog" disabled>Unavailable</a>`;
  protected readonly fluidCode = `<button uiButton variant="brand" fluid>Continue</button>`;

  constructor() {
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.completionTimer);
    });
  }

  protected save(): void {
    this.saving.set(true);
    clearTimeout(this.completionTimer);
    this.completionTimer = setTimeout(() => this.saving.set(false), 2000);
  }
}
