import {
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  type OnChanges,
  type SimpleChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

type MaskToken = '0' | '9' | 'A' | 'S' | 'U' | 'L';

const TOKEN_RULES: Record<MaskToken, RegExp> = {
  '0': /\d/u,
  '9': /\d/u,
  A: /[\p{L}\p{N}]/u,
  S: /\p{L}/u,
  U: /\p{L}/u,
  L: /\p{L}/u,
};

@Directive({
  selector: "input[uiMask]:not([type='number'])",
  providers: [
    {
      // Owning the value-accessor contract keeps Signal Forms and classic Angular
      // forms on the canonical, unmasked value instead of the formatted DOM value.
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiMask),
      multi: true,
    },
  ],
  host: {
    '(blur)': 'onTouched()',
    '(compositionend)': 'onCompositionEnd($event)',
    '(compositionstart)': 'onCompositionStart()',
    '(input)': 'onInput($event)',
  },
})
export class UiMask implements ControlValueAccessor, OnChanges {
  readonly mask = input('', { alias: 'uiMask' });
  readonly thousandSeparator = input(' ');
  readonly decimalMarker = input('.');

  private readonly element = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  private composing = false;
  private modelValue = '';
  private change: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mask'] || changes['thousandSeparator'] || changes['decimalMarker']) {
      this.writeValue(this.modelValue);
    }
  }

  writeValue(value: unknown) {
    this.modelValue = value == null ? '' : String(value);
    this.element.value = this.format(this.modelValue);
  }

  registerOnChange(change: (value: string) => void) {
    this.change = change;
  }

  registerOnTouched(touched: () => void) {
    this.onTouched = touched;
  }

  setDisabledState(disabled: boolean) {
    this.element.disabled = disabled;
  }

  protected onCompositionStart() {
    this.composing = true;
  }

  protected onCompositionEnd(event: Event) {
    this.composing = false;
    this.applyInput(event);
  }

  protected onInput(event: Event) {
    if (!this.composing) {
      this.applyInput(event);
    }
  }

  private applyInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const caret = input.selectionStart ?? input.value.length;
    const logicalCaret = this.logicalLength(input.value.slice(0, caret));
    const formatted = this.format(input.value);
    const formattedCaret = this.caretForLogicalLength(formatted, logicalCaret);

    input.value = formatted;
    input.setSelectionRange(formattedCaret, formattedCaret);

    this.modelValue = this.unmask(formatted);
    this.change(this.modelValue);
  }

  private format(value: string) {
    return this.separatorPrecision() === null
      ? this.formatPattern(value)
      : this.formatSeparator(value);
  }

  private unmask(value: string) {
    return this.separatorPrecision() === null
      ? this.unmaskPattern(value)
      : this.unmaskSeparator(value);
  }

  private formatPattern(value: string) {
    const mask = this.mask();
    const source = [...value];
    const result: string[] = [];
    let sourceIndex = 0;

    for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
      const maskCharacter = mask[maskIndex] as string;

      if (!isToken(maskCharacter)) {
        if (hasMatchingCharacter(source, sourceIndex, mask, maskIndex + 1)) {
          result.push(maskCharacter);
        }
        continue;
      }

      const match = findNextMatch(source, sourceIndex, maskCharacter);
      if (!match) {
        break;
      }

      sourceIndex = match.nextIndex;
      result.push(transformToken(match.character, maskCharacter));
    }

    return result.join('');
  }

  private unmaskPattern(value: string) {
    const mask = this.mask();
    const result: string[] = [];

    for (let index = 0; index < Math.min(value.length, mask.length); index++) {
      const maskCharacter = mask[index] as string;
      const valueCharacter = value[index] as string;

      if (isToken(maskCharacter) && TOKEN_RULES[maskCharacter].test(valueCharacter)) {
        result.push(valueCharacter);
      }
    }

    return result.join('');
  }

  private formatSeparator(value: string) {
    const precision = this.separatorPrecision() ?? 0;
    const decimalMarker = this.decimalMarker();
    const normalized = this.unmaskSeparator(value);
    const decimalIndex = normalized.indexOf(decimalMarker);
    const integer = decimalIndex === -1 ? normalized : normalized.slice(0, decimalIndex);
    const decimal = decimalIndex === -1 ? '' : normalized.slice(decimalIndex + decimalMarker.length);
    const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/gu, this.thousandSeparator());

    if (decimalIndex === -1 || precision === 0) {
      return grouped;
    }

    return `${grouped}${decimalMarker}${decimal.slice(0, precision)}`;
  }

  private unmaskSeparator(value: string) {
    const precision = this.separatorPrecision() ?? 0;
    const decimalMarker = this.decimalMarker();
    const groupSeparator = this.thousandSeparator();
    const withoutGroups = groupSeparator ? value.split(groupSeparator).join('') : value;
    const markerIndex = precision > 0 ? withoutGroups.indexOf(decimalMarker) : -1;
    const integerSource = markerIndex === -1 ? withoutGroups : withoutGroups.slice(0, markerIndex);
    const decimalSource = markerIndex === -1 ? '' : withoutGroups.slice(markerIndex + decimalMarker.length);
    const integer = integerSource.replace(/\D/gu, '');

    if (markerIndex === -1) {
      return integer;
    }

    return `${integer}${decimalMarker}${decimalSource.replace(/\D/gu, '').slice(0, precision)}`;
  }

  private logicalLength(value: string) {
    if (this.separatorPrecision() !== null) {
      return [...this.unmaskSeparator(value)].length;
    }

    return [...this.unmaskPattern(this.formatPattern(value))].length;
  }

  private caretForLogicalLength(value: string, logicalLength: number) {
    if (logicalLength === 0) {
      return 0;
    }

    for (let index = 1; index <= value.length; index++) {
      if (this.logicalLength(value.slice(0, index)) >= logicalLength) {
        return index;
      }
    }

    return value.length;
  }

  private separatorPrecision() {
    const match = /^separator(?:\.(\d+))?$/u.exec(this.mask());
    return match ? Number(match[1] ?? 0) : null;
  }
}

function isToken(character: string): character is MaskToken {
  return character in TOKEN_RULES;
}

function findNextMatch(source: string[], start: number, token: MaskToken) {
  for (let index = start; index < source.length; index++) {
    const character = source[index] as string;
    if (TOKEN_RULES[token].test(character)) {
      return { character, nextIndex: index + 1 };
    }
  }

  return null;
}

function hasMatchingCharacter(source: string[], start: number, mask: string, maskStart: number) {
  const nextToken = [...mask.slice(maskStart)].find(isToken);
  return nextToken ? findNextMatch(source, start, nextToken) !== null : false;
}

function transformToken(character: string, token: MaskToken) {
  if (token === 'U') {
    return character.toLocaleUpperCase();
  }
  if (token === 'L') {
    return character.toLocaleLowerCase();
  }
  return character;
}
