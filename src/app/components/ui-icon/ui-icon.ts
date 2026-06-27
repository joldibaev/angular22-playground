import { IconName, ICONS } from './data';
import {
  booleanAttribute,
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
  templateUrl: './ui-icon.html',
  styleUrl: './ui-icon.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex items-center justify-center',
    '[class.ui-icon-loading]': 'name() === "loading"',
    '[attr.aria-hidden]': 'isDecorative() ? "true" : null',
    '[attr.aria-label]': 'isDecorative() ? null : accessibleLabel()',
    '[attr.role]': 'isDecorative() ? "presentation" : "img"',
    '[innerHTML]': 'svgContent()',
  },
})
export class UiIcon {
  private readonly sanitizer = inject(DomSanitizer);

  name = input.required<IconName>();
  label = input('');
  decorative = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
  width = input(16, { transform: numberAttribute });
  height = input(16, { transform: numberAttribute });

  readonly accessibleLabel = computed(() => this.label().trim());
  readonly isDecorative = computed(() => this.decorative() ?? !this.accessibleLabel());

  svgContent = computed<SafeHtml | string>(() => {
    const iconName = this.name();
    const svgString = ICONS[iconName];

    if (!svgString) {
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
