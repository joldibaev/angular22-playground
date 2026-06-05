import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TabsHarness } from '@angular/aria/tabs/testing';
import { UiTab } from './ui-tab';
import { UiTabItem } from './ui-tab-item/ui-tab-item';

@Component({
  imports: [UiTab, UiTabItem],
  template: `
    <ui-tab [(selectedTab)]="selected">
      <ui-tab-item value="overview" label="Overview">Overview panel</ui-tab-item>
      <ui-tab-item value="activity" label="Activity">Activity panel</ui-tab-item>
      <ui-tab-item value="billing" label="Billing" [disabled]="true">Billing panel</ui-tab-item>
    </ui-tab>
  `,
})
class TestHost {
  readonly tab = viewChild.required(UiTab);
  readonly selected = signal<string | undefined>('overview');
}

@Component({
  imports: [UiTab, UiTabItem],
  template: `
    <ui-tab orientation="vertical" selectionMode="explicit">
      <ui-tab-item value="overview" label="Overview">Overview panel</ui-tab-item>
      <ui-tab-item value="activity" label="Activity">Activity panel</ui-tab-item>
    </ui-tab>
  `,
})
class VerticalTestHost {
  readonly tab = viewChild.required(UiTab);
}

async function createHostFixture(): Promise<ComponentFixture<TestHost>> {
  const hostFixture = TestBed.createComponent(TestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

async function createVerticalHostFixture(): Promise<ComponentFixture<VerticalTestHost>> {
  const hostFixture = TestBed.createComponent(VerticalTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

function getTabList(fixture: ComponentFixture<unknown>): HTMLElement {
  return (fixture.nativeElement as HTMLElement).querySelector('[role="tablist"]') as HTMLElement;
}

function getTabs(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]'),
  );
}

function getPanels(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('[role="tabpanel"]'),
  );
}

describe('UiTab', () => {
  let component: UiTab;
  let fixture: ComponentFixture<UiTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTab],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render projected items as Angular Aria tabs and panels', async () => {
    const hostFixture = await createHostFixture();
    const tabList = getTabList(hostFixture);
    const tabs = getTabs(hostFixture);
    const panels = getPanels(hostFixture);

    expect(tabList.getAttribute('aria-orientation')).toBe('horizontal');
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['Overview', 'Activity', 'Billing']);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
    expect(panels[0].textContent?.trim()).toBe('Overview panel');
    expect(panels[1].hasAttribute('inert')).toBe(true);
    expect(panels[2].hasAttribute('inert')).toBe(true);
    expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
  });

  it('should switch selected tabs with Angular Aria harnesses', async () => {
    const hostFixture = await createHostFixture();
    const loader = TestbedHarnessEnvironment.loader(hostFixture);
    const tabs = await loader.getHarness(TabsHarness);
    const tabItems = await tabs.getTabs();

    expect(await tabItems[0].isSelected()).toBe(true);

    await tabItems[1].select();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.selected()).toBe('activity');
    expect(await tabItems[0].isSelected()).toBe(false);
    expect(await tabItems[1].isSelected()).toBe(true);
  });

  it('should pass orientation and selection mode to the tab list', async () => {
    const hostFixture = await createVerticalHostFixture();
    const tabList = getTabList(hostFixture);

    expect(tabList.getAttribute('aria-orientation')).toBe('vertical');
    expect(hostFixture.componentInstance.tab().orientation()).toBe('vertical');
    expect(hostFixture.componentInstance.tab().selectionMode()).toBe('explicit');
  });

  it('should default to the first enabled tab when no selected tab is provided', async () => {
    const hostFixture = await createVerticalHostFixture();

    expect(hostFixture.componentInstance.tab().selectedTab()).toBe('overview');
    expect(getTabs(hostFixture)[0].getAttribute('aria-selected')).toBe('true');
  });

  it('should configure the active indicator with css anchor positioning', async () => {
    const hostFixture = await createHostFixture();
    const selectedTab = getTabs(hostFixture)[0];
    const indicator = hostFixture.nativeElement.querySelector('.ui-tab-indicator') as HTMLElement;
    const host = hostFixture.nativeElement.querySelector('ui-tab') as HTMLElement;
    const selectedTabStyle = getComputedStyle(selectedTab);
    const indicatorStyle = getComputedStyle(indicator);
    const hostStyle = getComputedStyle(host);

    expect(hostStyle.anchorScope).toBe('--ui-tab-active');
    expect(selectedTabStyle.anchorName).toBe('--ui-tab-active');
    expect(indicatorStyle.position).toBe('absolute');
    expect(indicatorStyle.positionAnchor).toBe('--ui-tab-active');
  });
});
