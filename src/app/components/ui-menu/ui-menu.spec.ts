import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MenuHarness } from '@angular/aria/menu/testing';
import { UiButton } from '../ui-button/ui-button';
import { UiMenu } from './ui-menu';
import { UiMenuGroup } from './ui-menu-group/ui-menu-group';
import { UiMenuItem } from './ui-menu-item/ui-menu-item';
import { UiMenuTrigger } from './ui-menu-trigger/ui-menu-trigger';

@Component({
  imports: [UiButton, UiMenu, UiMenuItem, UiMenuTrigger],
  template: `
    <button uiButton uiMenuTrigger variant="outline" [menu]="menu.menu()">Ticket actions</button>

    <ui-menu #menu (itemSelected)="selected.set($event)">
      <ui-menu-item value="assign">
        <span slot="start" aria-hidden="true"></span>
        <span>Assign owner</span>
        <span slot="end" aria-hidden="true"></span>
      </ui-menu-item>
      <ui-menu-item value="snooze">Snooze</ui-menu-item>
      <ui-menu-item value="delete" variant="destructive" [disabled]="true">Delete</ui-menu-item>
    </ui-menu>
  `,
})
class TestHost {
  readonly menu = viewChild.required(UiMenu);
  readonly selected = signal('');
}

@Component({
  imports: [UiButton, UiMenu, UiMenuItem, UiMenuTrigger],
  template: `
    <button uiButton uiMenuTrigger variant="outline" [menu]="commandMenu.menu()">
      Command menu
    </button>
    <ui-menu #commandMenu>
      <ui-menu-item value="duplicate">Duplicate</ui-menu-item>
    </ui-menu>

    <button uiButton uiMenuTrigger variant="outline" [menu]="statusMenu.menu()">Status menu</button>
    <ui-menu #statusMenu>
      <ui-menu-item value="todo">Todo</ui-menu-item>
    </ui-menu>
  `,
})
class MultipleMenuHost {}

@Component({
  imports: [UiButton, UiMenu, UiMenuGroup, UiMenuItem, UiMenuTrigger],
  template: `
    <button uiButton uiMenuTrigger variant="outline" [menu]="groupedMenu.menu()">
      Grouped actions
    </button>

    <ui-menu #groupedMenu (itemSelected)="selected.set($event)">
      <ui-menu-item value="inspect">Inspect</ui-menu-item>

      <ui-menu-group label="Editing">
        <ui-menu-item value="duplicate">Duplicate</ui-menu-item>
        <ui-menu-item value="archive" disabled>Archive</ui-menu-item>
      </ui-menu-group>

      <ui-menu-group>
        <ui-menu-item value="delete">Delete</ui-menu-item>
      </ui-menu-group>
    </ui-menu>
  `,
})
class GroupedMenuHost {
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
    expect(trigger.style.anchorName).toMatch(/^--ui-menu-trigger-\d+$/);
  });

  it('should render projected items as Angular Aria menu items when opened', async () => {
    const hostFixture = await createHostFixture();
    const trigger = getTrigger(hostFixture);

    trigger.click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    const firstItemChildren = Array.from(
      getMenuItems()[0].querySelectorAll<HTMLElement>('[slot]'),
    );

    expect(firstItemChildren.map((child) => child.getAttribute('slot'))).toEqual(['start', 'end']);

    const menu = getMenu();
    const items = getMenuItems();
    const menuStyle = getComputedStyle(menu);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('popover')).toBe('auto');
    expect(menuStyle.position).toBe('fixed');
    expect(menuStyle.inset).toBe('auto');
    expect(menuStyle.positionAnchor).toBe(trigger.style.anchorName);
    expect(menuStyle.top).toContain('anchor(bottom)');
    expect(menuStyle.top).toContain('var(--ui-popup-offset)');
    expect(menuStyle.margin).toBe('0px');
    expect(menuStyle.positionTryFallbacks).toContain('flip-block');
    expect(items.map((item) => item.textContent?.trim())).toEqual([
      'Assign owner',
      'Snooze',
      'Delete',
    ]);
    expect(items[2].getAttribute('aria-disabled')).toBe('true');
    expect(items[0].dataset['variant']).toBe('default');
    expect(items[2].dataset['variant']).toBe('destructive');
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

  it('should anchor each menu panel to its own trigger when multiple menus render together', async () => {
    const hostFixture = TestBed.createComponent(MultipleMenuHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    const hostElement = hostFixture.nativeElement as HTMLElement;
    const triggers = Array.from(
      hostElement.querySelectorAll<HTMLButtonElement>('button[uiMenuTrigger]'),
    );
    const menus = Array.from(document.querySelectorAll<HTMLElement>('[role="menu"]'));

    expect(triggers.length).toBe(2);
    expect(menus.length).toBe(2);
    expect(triggers[0].style.anchorName).not.toBe(triggers[1].style.anchorName);
    expect(getComputedStyle(menus[0]).positionAnchor).toBe(triggers[0].style.anchorName);
    expect(getComputedStyle(menus[1]).positionAnchor).toBe(triggers[1].style.anchorName);
  });

  it('should preserve item order and expose labelled menu groups with separators', async () => {
    const hostFixture = TestBed.createComponent(GroupedMenuHost);
    const loader = TestbedHarnessEnvironment.loader(hostFixture);

    await hostFixture.whenStable();
    await hostFixture.whenRenderingDone();

    const menu = await loader.getHarness(MenuHarness.with({ triggerText: 'Grouped actions' }));
    await menu.open();

    const panel = document.querySelector<HTMLElement>('[role="menu"][data-visible="true"]');
    const groups = Array.from(panel?.querySelectorAll<HTMLElement>('[role="group"]') ?? []);
    const separators = panel?.querySelectorAll('hr.ui-menu-separator') ?? [];
    const items = await menu.getItems();

    expect(groups).toHaveLength(2);
    expect(groups[0].getAttribute('aria-label')).toBe('Editing');
    expect(groups[0].querySelector('.ui-menu-group-label')?.textContent?.trim()).toBe('Editing');
    expect(groups[1].hasAttribute('aria-label')).toBe(false);
    expect(separators).toHaveLength(2);
    expect(await Promise.all(items.map((item) => item.getText()))).toEqual([
      'Inspect',
      'Duplicate',
      'Archive',
      'Delete',
    ]);

    await items[1].click();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.selected()).toBe('duplicate');
  });
});
