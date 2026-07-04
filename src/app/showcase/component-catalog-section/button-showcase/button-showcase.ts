import { Component } from '@angular/core';
import { UiButton, type UiButtonVariant } from '../../../components/ui-button/ui-button';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';
@Component({
  selector: 'app-button-showcase',
  imports: [UiButton, UiCard, UiIcon, UiTab, UiTabItem],
  templateUrl: './button-showcase.html',
  styleUrl: './button-showcase.css',
})
export class ButtonShowcase {
  protected readonly variants: UiButtonVariant[] = [
    'default',
    'brand',
    'outline',
    'destructive',
    'secondary',
    'ghost',
    'link',
  ];
  protected readonly variantsCode = `<button uiButton>Default</button>\n<button uiButton variant="brand">Brand</button>\n<button uiButton variant="outline">Outline</button>\n<button uiButton variant="destructive">Destructive</button>`;
  protected readonly sizesCode = `<button uiButton size="sm">Small</button>\n<button uiButton>Medium</button>\n<button uiButton rounded>Pill</button>`;
  protected readonly statesCode = `<button uiButton disabled>Disabled</button>\n<button uiButton loading>Saving</button>`;
  protected readonly iconsCode = `<button uiButton variant="brand">\n  <ui-icon name="outline-plus" decorative /> Create\n</button>\n<button uiButton iconOnly aria-label="Settings">…</button>`;
  protected readonly anchorCode = `<a uiButton href="/docs" variant="outline">Open docs</a>\n<a uiButton href="/docs" disabled>Unavailable</a>`;
  protected readonly fluidCode = `<button uiButton variant="brand" fluid>Continue</button>`;
}
