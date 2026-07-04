import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiTree } from './ui-tree';
import { UiTreeItem } from './ui-tree.type';

@Component({
  imports: [UiTree],
  template: `
    <ui-tree
      [items]="items()"
      [multi]="multi()"
      [nav]="nav()"
      [withGuides]="withGuides()"
      [(selected)]="selected"
      [(expanded)]="expanded"
    />
  `,
})
class TestHost {
  readonly items = signal<UiTreeItem[]>([
    {
      id: 'src',
      label: 'src',
      icon: 'outline-folder',
      expanded: true,
      children: [
        { id: 'main', label: 'main.ts' },
        { id: 'styles', label: 'styles.css', disabled: true },
      ],
    },
    {
      id: 'docs',
      label: 'docs',
      icon: 'outline-folder',
      children: [{ id: 'readme', label: 'README.md' }],
    },
  ]);
  readonly multi = signal(false);
  readonly nav = signal(false);
  readonly withGuides = signal(true);
  readonly selected = signal<string[]>([]);
  readonly expanded = signal<string[] | undefined>(undefined);
}

async function createHost(): Promise<ComponentFixture<TestHost>> {
  const fixture = TestBed.createComponent(TestHost);
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture;
}

function items(fixture: ComponentFixture<TestHost>): HTMLElement[] {
  const host = fixture.nativeElement as HTMLElement;
  return Array.from(host.querySelectorAll<HTMLElement>('[role="treeitem"]'));
}

function itemByText(fixture: ComponentFixture<TestHost>, text: string): HTMLElement {
  return items(fixture).find((el) => el.textContent?.trim() === text)!;
}

describe('UiTree', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
  });

  it('renders an accessible tree of the top-level items', async () => {
    const fixture = await createHost();
    const tree = fixture.nativeElement.querySelector('[role="tree"]');
    const labels = items(fixture).map((el) => el.textContent?.trim());

    expect(tree).toBeTruthy();
    // Only the expanded branch's children are projected; `docs` stays collapsed.
    expect(labels).toEqual(['src', 'main.ts', 'styles.css', 'docs']);
  });

  it('only renders a branch\'s children once it is expanded', async () => {
    const fixture = await createHost();

    expect(itemByText(fixture, 'README.md')).toBeUndefined();

    fixture.componentInstance.items.update((tree) =>
      tree.map((node) => (node.id === 'docs' ? { ...node, expanded: true } : node)),
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(itemByText(fixture, 'README.md')).toBeTruthy();
  });

  it('reflects expanded state through aria-expanded', async () => {
    const fixture = await createHost();

    expect(itemByText(fixture, 'src').getAttribute('aria-expanded')).toBe('true');
    expect(itemByText(fixture, 'docs').getAttribute('aria-expanded')).toBe('false');
  });

  it('controls expansion without mutating input items', async () => {
    const fixture = await createHost();
    const source = fixture.componentInstance.items();

    fixture.componentInstance.expanded.set(['docs']);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(itemByText(fixture, 'README.md')).toBeTruthy();
    expect(source[0].expanded).toBe(true);
    expect(source[1].expanded).toBeUndefined();
  });

  it('marks disabled items as non-interactive', async () => {
    const fixture = await createHost();
    expect(itemByText(fixture, 'styles.css').getAttribute('aria-disabled')).toBe('true');
  });

  it('selects a node on click and writes it back to the two-way model', async () => {
    const fixture = await createHost();

    itemByText(fixture, 'main.ts').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.selected()).toEqual(['main']);
    expect(itemByText(fixture, 'main.ts').getAttribute('aria-selected')).toBe('true');
  });

  it('uses aria-current instead of aria-selection in nav mode', async () => {
    const fixture = await createHost();
    fixture.componentInstance.nav.set(true);
    fixture.detectChanges();

    itemByText(fixture, 'main.ts').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(itemByText(fixture, 'main.ts').getAttribute('aria-current')).toBe('page');
  });

  it('toggles the guide-line styling hook from withGuides', async () => {
    const fixture = await createHost();
    const host = fixture.nativeElement.querySelector('ui-tree') as HTMLElement;

    expect(host.classList.contains('ui-tree-flush')).toBe(false);

    fixture.componentInstance.withGuides.set(false);
    fixture.detectChanges();

    expect(host.classList.contains('ui-tree-flush')).toBe(true);
  });
});
