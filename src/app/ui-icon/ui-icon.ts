import { IconName, ICONS } from './data';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ui-icon',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex items-center justify-center',
    '[attr.aria-hidden]': 'decorative()',
    '[attr.aria-label]': 'decorative() ? null : label()',
    '[attr.role]': 'decorative() ? "presentation" : "img"',
    '[innerHTML]': 'svgContent()',
  },
})
export class UiIcon {
  private readonly sanitizer = inject(DomSanitizer);

  name = input.required<IconName>();
  label = input('');
  decorative = input(true);
  width = input(16, { transform: numberAttribute });
  height = input(16, { transform: numberAttribute });

  svgContent = computed<SafeHtml | string>(() => {
    const iconName = this.name();
    const svgString = ICONS[iconName];

    if (!svgString) {
      console.warn(`Icon not found: ${iconName}`);
      return '';
    }

    const cleaned = svgString.replace(
      /<svg([^>]*?)>/,
      (_match: string, attrs: string) =>
        `<svg${attrs.replace(/\swidth="[^"]*"/g, '').replace(/\sheight="[^"]*"/g, '')}>`,
    );

    const replaced = cleaned.replace(
      /<svg([^>]*?)>/,
      (_match: string, attrs: string) =>
        `<svg${attrs} width="${this.width()}" height="${this.height()}">`,
    );

    // ICONS is generated from local SVG assets and `name` is restricted to generated keys.
    return this.sanitizer.bypassSecurityTrustHtml(replaced);
  });
}
