import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiMenu } from '../ui-menu';
import { UiMenuItem } from '../ui-menu-item/ui-menu-item';
import { UiMenuTrigger } from './ui-menu-trigger';

@Component({
  imports: [UiMenu, UiMenuItem, UiMenuTrigger],
  template: `
    <button uiMenuTrigger [menu]="menu.menu()">Actions</button>
    <ui-menu #menu><ui-menu-item value="edit">Edit</ui-menu-item></ui-menu>
  `,
})
class TestHost {}

describe('UiMenuTrigger', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  });

  it('connects the trigger and menu with a stable CSS anchor', () => {
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const menu = document.querySelector('[role="menu"]') as HTMLElement;

    expect(trigger.classList.contains('ui-menu-trigger')).toBe(true);
    expect(trigger.style.anchorName).toMatch(/^--ui-menu-trigger-\d+$/);
    expect(menu.style.positionAnchor).toBe(trigger.style.anchorName);
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('removes only its own anchor assignment on destroy', () => {
    const menu = document.querySelector('[role="menu"]') as HTMLElement;

    expect(menu.style.positionAnchor).not.toBe('');
    fixture.destroy();
    expect(menu.style.positionAnchor).toBe('');
  });
});
