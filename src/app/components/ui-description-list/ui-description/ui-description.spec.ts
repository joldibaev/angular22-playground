import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDescriptionList } from '../ui-description-list';
import { UiDescription } from './ui-description';

@Component({
  imports: [UiDescriptionList, UiDescription],
  template: `
    <ui-description-list>
      <div uiDescription="Email" icon="outline-at">account@example.com</div>
    </ui-description-list>
  `,
})
class TestHost {}

describe('UiDescription', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
  });

  it('should render its label, optional decorative icon, and projected value', () => {
    const item = fixture.nativeElement.querySelector('div[uiDescription]') as HTMLDivElement;
    const term = item.querySelector('dt') as HTMLElement;
    const details = item.querySelector('dd') as HTMLElement;

    expect(item.classList.contains('ui-description')).toBe(true);
    expect(term.textContent?.trim()).toBe('Email');
    expect(term.querySelector('ui-icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(details.textContent?.trim()).toBe('account@example.com');
  });
});
