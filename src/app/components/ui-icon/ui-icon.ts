import { IconName, ICONS } from './data';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';

@Component({
  selector: 'ui-icon',
  templateUrl: './ui-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex items-center justify-center',
    '[attr.aria-hidden]': 'isDecorative() ? "true" : null',
    '[attr.aria-label]': 'isDecorative() ? null : accessibleLabel()',
    '[attr.role]': 'isDecorative() ? "presentation" : "img"',
  },
})
export class UiIcon {
  name = input.required<IconName>();
  label = input('');
  decorative = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
  width = input(16, { transform: numberAttribute });
  height = input(16, { transform: numberAttribute });

  readonly accessibleLabel = computed(() => this.label().trim());
  // A caller may explicitly hide a labelled icon, but can never expose an
  // unlabelled image to assistive technology.
  readonly isDecorative = computed(() => this.decorative() === true || !this.accessibleLabel());

  protected readonly svgDefinition = computed(() => {
    const iconName = this.name();
    const svgString = ICONS[iconName];

    if (!svgString) {
      return null;
    }

    const rootAttributes = parseAttributes(/<svg\s+([^>]+)>/u.exec(svgString)?.[1] ?? '');
    const paths = Array.from(svgString.matchAll(/<path\s+d="([^"]+)"\s*\/>/gu), (match) => match[1]);

    // Only data consumed by explicit Angular attribute bindings survives this
    // parser. Unknown tags/attributes from a compromised generator are ignored.
    return {
      viewBox: rootAttributes['viewBox'] ?? '0 0 24 24',
      fill: rootAttributes['fill'] ?? null,
      stroke: rootAttributes['stroke'] ?? null,
      strokeWidth: rootAttributes['stroke-width'] ?? null,
      strokeLinecap: rootAttributes['stroke-linecap'] ?? null,
      strokeLinejoin: rootAttributes['stroke-linejoin'] ?? null,
      paths,
    };
  });
}

function parseAttributes(source: string): Record<string, string> {
  return Object.fromEntries(
    Array.from(source.matchAll(/([\w-]+)="([^"]*)"/gu), (match) => [match[1], match[2]]),
  );
}
