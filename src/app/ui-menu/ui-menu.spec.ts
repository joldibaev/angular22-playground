import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MenuHarness } from '@angular/aria/menu/testing';
import { UiMenu } from './ui-menu';
import { UiMenuItem } from './ui-menu-item/ui-menu-item';
import { UiMenuTrigger } from './ui-menu-trigger/ui-menu-trigger';

@Component({
  imports: [UiMenu, UiMenuItem, UiMenuTrigger],
  template: `
    <button uiMenuTrigger [menu]="menu.menu()">Ticket actions</button>

    <ui-menu #menu (itemSelected)="selected.set($event)">
      <ui-menu-item value="assign">Assign owner</ui-menu-item>
      <ui-menu-item value="snooze">Snooze</ui-menu-item>
      <ui-menu-item value="delete" [disabled]="true">Delete</ui-menu-item>
    </ui-menu>
  `,
})
class TestHost {
  readonly menu = viewChild.required(UiMenu);
  readonly selected = signal('');
}

async function createHostFixture(): Promise<ComponentFixture<TestHost>> {
  const hostFixture = TestBed.createComponent(TestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

function getTrigger(fixture: ComponentFixture<TestHost>): HTMLButtonElement {
  return fixture.nativeElement.querySelector('button[uiMenuTrigger]');
}

function getMenu(): HTMLElement {
  return document.querySelector('[role="menu"]') as HTMLElement;
}

function getMenuItems(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'));
}

describe('UiMenu', () => {
  let component: UiMenu;
  let fixture: ComponentFixture<UiMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should connect an independent button trigger with menu accessibility attributes', async () => {
    const hostFixture = await createHostFixture();
    const trigger = getTrigger(hostFixture);

    expect(trigger).toBeTruthy();
    expect(trigger.type).toBe('button');
    expect(trigger.textContent?.trim()).toBe('Ticket actions');
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.style.anchorName).toBe('--ui-menu-trigger');
  });

  it('should render projected items as Angular Aria menu items when opened', async () => {
    const hostFixture = await createHostFixture();
    const trigger = getTrigger(hostFixture);

    trigger.click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    const menu = getMenu();
    const items = getMenuItems();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu.getAttribute('role')).toBe('menu');
    expect(items.map((item) => item.textContent?.trim())).toEqual([
      'Assign owner',
      'Snooze',
      'Delete',
    ]);
    expect(items[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('should emit the selected item value and close through Angular Aria harnesses', async () => {
    const hostFixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(hostFixture);
    const menu = await loader.getHarness(MenuHarness.with({ triggerText: 'Ticket actions' }));

    expect(await menu.isOpen()).toBe(false);

    await menu.open();
    expect(await menu.isOpen()).toBe(true);

    const items = await menu.getItems();
    expect(await Promise.all(items.map((item) => item.getText()))).toEqual([
      'Assign owner',
      'Snooze',
      'Delete',
    ]);

    await items[0].click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    hostFixture.detectChanges();
    await hostFixture.whenRenderingDone();

    expect(hostFixture.componentInstance.selected()).toBe('assign');
    expect(getTrigger(hostFixture).getAttribute('aria-expanded')).toBe('false');
  });
});
