import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AutocompleteShowcase } from './autocomplete-showcase';
describe('AutocompleteShowcase', () => {
  it('documents filtering, values, states, copy, and Signal Forms', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const f = TestBed.createComponent(AutocompleteShowcase);
    await f.whenStable();
    expect(f.nativeElement.querySelectorAll('ui-card')).toHaveLength(7);
    expect(f.nativeElement.textContent).toContain('HTTP search with httpResource');
    expect(f.nativeElement.textContent).toContain('HTTP search with HttpClient and RxJS');
    expect(f.nativeElement.textContent).toContain('Signal Forms');
  });
});
