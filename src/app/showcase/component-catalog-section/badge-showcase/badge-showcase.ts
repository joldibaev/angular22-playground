import { Component } from '@angular/core';
import { UiBadge } from '../../../components/ui-badge/ui-badge';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiIcon } from '../../../components/ui-icon/ui-icon';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-badge-showcase',
  imports: [UiBadge, UiCard, UiIcon, UiTab, UiTabItem],
  templateUrl: './badge-showcase.html',
  styleUrl: './badge-showcase.css',
})
export class BadgeShowcase {
  protected readonly defaultCode = `import { UiBadge } from './components/ui-badge/ui-badge';\n\n<ui-badge>Draft</ui-badge>`;
  protected readonly variantsCode = `<ui-badge>Secondary</ui-badge>\n<ui-badge variant="contrast">Contrast</ui-badge>\n<ui-badge variant="brand">Brand</ui-badge>\n<ui-badge variant="outline">Outline</ui-badge>\n<ui-badge variant="destructive">Destructive</ui-badge>`;
  protected readonly dotCode = `<ui-badge withDot>Processing</ui-badge>\n<ui-badge variant="destructive" withDot>Blocked</ui-badge>`;
  protected readonly iconCode = `<ui-badge variant="brand">\n  <ui-icon name="outline-circle-check" decorative />\n  Verified\n</ui-badge>`;
}
