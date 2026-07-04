import { TestBed } from '@angular/core/testing';
import { AutocompleteShowcase } from './autocomplete-showcase';
describe('AutocompleteShowcase', () => {
  it('documents filtering, values, states, copy, and Signal Forms', async () => {
    const f = TestBed.createComponent(AutocompleteShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(5);
    expect(f.nativeElement.textContent).toContain('Signal Forms');
  });
});
