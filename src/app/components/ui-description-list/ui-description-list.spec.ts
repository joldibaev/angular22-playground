import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDescription } from './ui-description/ui-description';
import { UiDescriptionList } from './ui-description-list';

@Component({
  imports: [UiDescriptionList, UiDescription],
  template: `
    <ui-description-list aria-label="Account details">
      <div uiDescription="Username">anji</div>
      <div uiDescription="Role">Administrator</div>
    </ui-description-list>
  `,
})
class TestHost {}

describe('UiDescriptionList', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  it('should own the native description-list semantics and accessible name', () => {
    const host = fixture.nativeElement.querySelector('ui-description-list') as HTMLElement;
    const list = host.querySelector('dl') as HTMLDListElement;

    expect(list.classList.contains('ui-description-list')).toBe(true);
    expect(list.getAttribute('aria-label')).toBe('Account details');
    expect(list.querySelectorAll(':scope > div[uiDescription]')).toHaveLength(2);
    expect(list.querySelectorAll('dt')).toHaveLength(2);
    expect(list.querySelectorAll('dd')).toHaveLength(2);
  });
});
