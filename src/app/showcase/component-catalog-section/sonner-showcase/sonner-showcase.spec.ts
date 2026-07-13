import { TestBed } from '@angular/core/testing';
import { SonnerService } from '../../../components/ui-sonner/sonner.service';
import { UiSonner } from '../../../components/ui-sonner/ui-sonner';
import { UiSonnerToast } from '../../../components/ui-sonner/ui-sonner-toast/ui-sonner-toast';
import { SonnerShowcase } from './sonner-showcase';

describe('SonnerShowcase', () => {
  let sonner: SonnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [UiSonner] });
    TestBed.overrideComponent(UiSonner, { set: { styles: [] } });
    TestBed.overrideComponent(UiSonnerToast, { set: { styles: [] } });
    sonner = TestBed.inject(SonnerService);
    sonner.reset();
  });

  afterEach(() => sonner.reset());

  it('documents the complete creator API and renders an interactive toast', async () => {
    const fixture = TestBed.createComponent(SonnerShowcase);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Promise');
    expect(text).toContain('Toaster options');
    expect(fixture.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(10);

    const showButton = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
      (button) => (button as HTMLButtonElement).textContent?.trim() === 'Show toast',
    ) as HTMLButtonElement;
    showButton.click();
    await fixture.whenStable();

    expect(document.querySelector('[data-sonner-toast]')?.textContent).toContain(
      'Price alert created',
    );
  });
});
