import { TestBed } from '@angular/core/testing';
import { DialogShowcase } from './dialog-showcase';

describe('DialogShowcase', () => {
  it('documents the dialog and confirmation APIs with focused examples', async () => {
    const fixture = TestBed.createComponent(DialogShowcase);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Role and description');
    expect(text).toContain('Nested dialogs');
    expect(text).toContain('Scrollable content');
    expect(fixture.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(8);
    expect(fixture.nativeElement.querySelectorAll('ui-dialog')).toHaveLength(15);
    expect(fixture.nativeElement.querySelector('ui-dialog-confirm')).toBeNull();
  });
});
