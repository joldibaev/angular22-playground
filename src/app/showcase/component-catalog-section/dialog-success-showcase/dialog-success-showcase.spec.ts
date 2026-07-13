import { TestBed } from '@angular/core/testing';
import { DialogSuccessShowcase } from './dialog-success-showcase';

describe('DialogSuccessShowcase', () => {
  it('documents default and custom success outcomes', async () => {
    const fixture = TestBed.createComponent(DialogSuccessShowcase);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('ui-dialog-success')).toHaveLength(2);
    expect(fixture.nativeElement.textContent).toContain('Custom action');
  });

  it('reports the custom acknowledgement action', async () => {
    const fixture = TestBed.createComponent(DialogSuccessShowcase);
    await fixture.whenStable();

    const action = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.ui-dialog-success-actions button',
      ) as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Open workspace')) as HTMLButtonElement;

    action.click();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Workspace opened');
  });
});
