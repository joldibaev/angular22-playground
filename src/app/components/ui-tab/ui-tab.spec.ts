import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TabsHarness } from '@angular/aria/tabs/testing';
import { Router, provideRouter } from '@angular/router';
import { UiTab } from './ui-tab';
import { UiTabItem } from './ui-tab-item/ui-tab-item';
import { UiTabLabel } from './ui-tab-item/ui-tab-label';

@Component({
  imports: [UiTab, UiTabItem, UiTabLabel],
  template: `
    <ui-tab [(selectedTab)]="selected">
      <ui-tab-item value="overview">
        <ng-template uiTabLabel>
          <span slot="start" aria-hidden="true"></span>
          <span>Overview</span>
          <span slot="end" aria-hidden="true"></span>
        </ng-template>
        Overview panel
      </ui-tab-item>
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

@Component({
  imports: [UiTab, UiTabItem],
  template: `
    <ui-tab queryParam="section">
      <ui-tab-item value="overview" label="Overview">Overview panel</ui-tab-item>
      <ui-tab-item value="activity" label="Activity">Activity panel</ui-tab-item>
    </ui-tab>
  `,
})
class QueryParamTestHost {
  readonly tab = viewChild.required(UiTab);
}

@Component({
  imports: [UiTab, UiTabItem],
  template: `
    <ui-tab variant="line" fluid>
      <ui-tab-item value="overview" label="Overview">Overview panel</ui-tab-item>
      <ui-tab-item value="activity" label="Activity">Activity panel</ui-tab-item>
    </ui-tab>
  `,
})
class LineFluidTestHost {
  readonly tab = viewChild.required(UiTab);
}

@Component({
  imports: [UiTab, UiTabItem, UiTabLabel],
  template: `
    <ui-tab>
      <ui-tab-item value="preview" label="Preview">
        <ui-tab>
          <ui-tab-item value="overview">
            <ng-template uiTabLabel>Overview</ng-template>
            Overview panel
          </ui-tab-item>
          <ui-tab-item value="activity" label="Activity">Activity panel</ui-tab-item>
        </ui-tab>
      </ui-tab-item>
      <ui-tab-item value="code" label="Code">Code panel</ui-tab-item>
    </ui-tab>
  `,
})
class NestedTestHost {}

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

async function createQueryParamHostFixture(): Promise<ComponentFixture<QueryParamTestHost>> {
  const hostFixture = TestBed.createComponent(QueryParamTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

async function createLineFluidHostFixture(): Promise<ComponentFixture<LineFluidTestHost>> {
  const hostFixture = TestBed.createComponent(LineFluidTestHost);
  hostFixture.detectChanges();
  await hostFixture.whenStable();
  await hostFixture.whenRenderingDone();

  return hostFixture;
}

function getHost(fixture: ComponentFixture<unknown>): HTMLElement {
  return (fixture.nativeElement as HTMLElement).querySelector('ui-tab') as HTMLElement;
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

function getTabTriggers(fixture: ComponentFixture<unknown>): HTMLElement[] {
  return Array.from(
    (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.ui-tab-trigger'),
  );
}

function getTabIndicator(fixture: ComponentFixture<unknown>): HTMLElement {
  return (fixture.nativeElement as HTMLElement).querySelector('.ui-tab-indicator') as HTMLElement;
}

describe('UiTab', () => {
  let component: UiTab;
  let fixture: ComponentFixture<UiTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTab],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the compact size class for sm', async () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).classList.contains('ui-tab-sm')).toBe(true);
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
    expect(
      Array.from(tabs[0].querySelectorAll<HTMLElement>('[slot]')).map((child) =>
        child.getAttribute('slot'),
      ),
    ).toEqual(['start', 'end']);
  });

  it('should not use a nested tab label as the parent item label', async () => {
    const hostFixture = TestBed.createComponent(NestedTestHost);
    await hostFixture.whenStable();

    const outerTabList = hostFixture.nativeElement.querySelector(
      'ui-tab > .ui-tab-root > [role="tablist"]',
    ) as HTMLElement;
    const outerTabs = Array.from(outerTabList.children).filter(
      (child): child is HTMLElement => child.getAttribute('role') === 'tab',
    );

    expect(outerTabs.map((tab) => tab.textContent?.trim())).toEqual(['Preview', 'Code']);
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
    const selectedItem = getTabTriggers(hostFixture)[0];
    const indicator = getTabIndicator(hostFixture);
    const selectedItemStyle = getComputedStyle(selectedItem);
    const indicatorStyle = getComputedStyle(indicator);

    expect(selectedItemStyle.anchorName).toMatch(/^--ui-tab-\d+-0$/);
    expect(indicatorStyle.position).toBe('absolute');
    expect(indicatorStyle.positionAnchor).toBe(selectedItemStyle.anchorName);
  });

  it('should use the pills variant by default', async () => {
    const hostFixture = await createHostFixture();
    const host = getHost(hostFixture);

    expect(host.classList.contains('ui-tab-pills')).toBe(true);
    expect(host.classList.contains('ui-tab-line')).toBe(false);
    expect(host.classList.contains('ui-tab-fluid')).toBe(false);
    expect(hostFixture.componentInstance.tab().variant()).toBe('pills');
    expect(hostFixture.componentInstance.tab().fluid()).toBe(false);
  });

  it('should support line variant and fluid layout', async () => {
    const hostFixture = await createLineFluidHostFixture();
    const host = getHost(hostFixture);
    const tabList = getTabList(hostFixture);
    const firstItem = getTabTriggers(hostFixture)[0];
    const indicator = getTabIndicator(hostFixture);
    const hostStyle = getComputedStyle(host);
    const tabListStyle = getComputedStyle(tabList);
    const firstItemStyle = getComputedStyle(firstItem);
    const indicatorStyle = getComputedStyle(indicator);

    expect(host.classList.contains('ui-tab-line')).toBe(true);
    expect(host.classList.contains('ui-tab-pills')).toBe(false);
    expect(host.classList.contains('ui-tab-fluid')).toBe(true);
    expect(hostFixture.componentInstance.tab().variant()).toBe('line');
    expect(hostFixture.componentInstance.tab().fluid()).toBe(true);
    expect(hostStyle.width).toBe('100%');
    expect(tabListStyle.width).toBe('100%');
    expect(firstItemStyle.flexGrow).toBe('1');
    expect(indicatorStyle.height).toBe('var(--ui-tab-line-indicator-size)');
  });

  it('should keep horizontal tab overflow scrollable without a visible scrollbar', async () => {
    const hostFixture = await createHostFixture();
    const tabListStyle = getComputedStyle(getTabList(hostFixture));

    expect(tabListStyle.overflowX).toBe('auto');
    expect(tabListStyle.scrollbarWidth).toBe('none');
  });

  it('should initialize the selected tab from a query param', async () => {
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/?section=activity');

    const hostFixture = await createQueryParamHostFixture();

    expect(hostFixture.componentInstance.tab().selectedTab()).toBe('activity');
    expect(getTabs(hostFixture)[1].getAttribute('aria-selected')).toBe('true');
  });

  it('should fall back to the first enabled tab for an unknown query param', async () => {
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/?section=unknown');

    const hostFixture = await createQueryParamHostFixture();

    expect(hostFixture.componentInstance.tab().selectedTab()).toBe('overview');
    expect(getTabs(hostFixture)[0].getAttribute('aria-selected')).toBe('true');
  });

  it('should write the selected tab to the configured query param', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/?section=overview&ticket=42');

    const hostFixture = await createQueryParamHostFixture();
    const loader = TestbedHarnessEnvironment.loader(hostFixture);
    const tabs = await loader.getHarness(TabsHarness);

    await tabs.selectTab({ title: 'Activity' });
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const urlTree = router.parseUrl(router.url);

    expect(urlTree.queryParams['section']).toBe('activity');
    expect(urlTree.queryParams['ticket']).toBe('42');
  });

  it('should follow external query-param navigation after a manual selection', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/?section=overview');
    const hostFixture = await createQueryParamHostFixture();
    const loader = TestbedHarnessEnvironment.loader(hostFixture);
    const tabs = await loader.getHarness(TabsHarness);

    await tabs.selectTab({ title: 'Activity' });
    await hostFixture.whenStable();
    expect(hostFixture.componentInstance.tab().selectedTab()).toBe('activity');

    await router.navigateByUrl('/?section=overview');
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.tab().selectedTab()).toBe('overview');
    expect(getTabs(hostFixture)[0].getAttribute('aria-selected')).toBe('true');
  });
});
