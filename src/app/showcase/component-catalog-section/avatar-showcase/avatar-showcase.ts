import { ShowcaseCode } from '../showcase-code/showcase-code';
import { Component } from '@angular/core';
import { UiAvatar } from '../../../components/ui-avatar/ui-avatar';
import { UiCard } from '../../../components/ui-card/ui-card';
import { UiTab } from '../../../components/ui-tab/ui-tab';
import { UiTabItem } from '../../../components/ui-tab/ui-tab-item/ui-tab-item';

@Component({
  selector: 'app-avatar-showcase',
  imports: [ShowcaseCode, UiAvatar, UiCard, UiTab, UiTabItem],
  templateUrl: './avatar-showcase.html',
  styleUrl: './avatar-showcase.css',
})
export class AvatarShowcase {
  protected readonly defaultCode = `import { UiAvatar } from './components/ui-avatar/ui-avatar';

<ui-avatar
  name="Ada Lovelace"
  src="https://i.pravatar.cc/96?img=5"
/>`;

  protected readonly sizeCode = `<ui-avatar size="sm" name="Ada Lovelace" />
<ui-avatar size="md" name="Ada Lovelace" />
<ui-avatar size="lg" name="Ada Lovelace" />`;

  protected readonly fallbackCode = `<ui-avatar name="Grace Hopper" />

<!-- A failed image automatically falls back to initials. -->
<ui-avatar name="Broken Image" src="/missing-avatar.webp" />`;

  protected readonly placeholderCode = `<!-- Named avatars expose role="img" and the name as their label. -->
<ui-avatar name="Linus Torvalds" />

<!-- Anonymous placeholders are decorative and hidden from assistive technology. -->
<ui-avatar />`;
}
