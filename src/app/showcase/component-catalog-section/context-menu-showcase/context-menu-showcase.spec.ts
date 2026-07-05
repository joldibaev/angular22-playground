import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiContextMenuTrigger } from '../../../components/ui-context-menu/ui-context-menu-trigger/ui-context-menu-trigger';
import { UiMenuItem } from '../../../components/ui-menu/ui-menu-item/ui-menu-item';
import { ContextMenuShowcase } from './context-menu-showcase';

describe('ContextMenuShowcase', () => {
  it('documents pointer and keyboard invocation with contextual actions', async () => {
    const fixture = TestBed.createComponent(ContextMenuShowcase);
    await fixture.whenStable();

    expect(fixture.debugElement.queryAll(By.directive(UiContextMenuTrigger))).toHaveLength(3);
    expect(fixture.nativeElement.textContent).toContain('Shift+F10');
    const items = fixture.debugElement.queryAll(By.directive(UiMenuItem));
    expect(items).toHaveLength(4);
    expect(items.some((item) => item.componentInstance.variant() === 'destructive')).toBe(true);
  });
});
