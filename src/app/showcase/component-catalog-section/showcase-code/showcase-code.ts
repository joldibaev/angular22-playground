import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-typescript';

export type ShowcaseCodeLanguage = 'auto' | 'markup' | 'typescript' | 'css';

@Component({
  selector: 'app-showcase-code',
  templateUrl: './showcase-code.html',
  styleUrl: './showcase-code.css',
  // Prism creates token spans at runtime, outside Angular's emulated style attributes.
  encapsulation: ViewEncapsulation.None,
})
export class ShowcaseCode {
  readonly code = input.required<string>();
  readonly language = input<ShowcaseCodeLanguage>('auto');

  protected readonly highlightedCode = computed(() => {
    const language = this.language();

    if (language !== 'auto') {
      return this.highlight(this.code(), language);
    }

    return this.highlightAuto(this.code());
  });

  private highlightAuto(code: string): string {
    const lines = code.split('\n');
    const firstMarkupLine = lines.findIndex((line) => line.trimStart().startsWith('<'));

    if (firstMarkupLine === 0) {
      return this.highlight(code, 'markup');
    }

    if (firstMarkupLine > 0) {
      // Showcase examples often pair TypeScript state with a raw Angular template.
      return [
        this.highlight(lines.slice(0, firstMarkupLine).join('\n'), 'typescript'),
        this.highlight(lines.slice(firstMarkupLine).join('\n'), 'markup'),
      ].join('\n');
    }

    return this.highlight(code, 'typescript');
  }

  private highlight(code: string, language: Exclude<ShowcaseCodeLanguage, 'auto'>): string {
    return Prism.highlight(code, Prism.languages[language], language);
  }
}
