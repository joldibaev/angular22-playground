import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiAutocompleteOption } from './ui-autocomplete-option';

@Component({
  imports: [UiAutocompleteOption],
  template: '<ui-autocomplete-option value="approved">Approved</ui-autocomplete-option>',
})
class TestHost {
  readonly option = viewChild.required(UiAutocompleteOption);
}

describe('UiAutocompleteOption', () => {
  let component: UiAutocompleteOption;
  let fixture: ComponentFixture<UiAutocompleteOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAutocompleteOption],
    }).compileComponents();

    fixture = TestBed.createComponent(UiAutocompleteOption);
    fixture.componentRef.setInput('value', 'created');
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the required value input', () => {
    expect(component.value()).toBe('created');
  });

  it('should use projected text as its label', async () => {
    const hostFixture = TestBed.createComponent(TestHost);
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.option().label()).toBe('Approved');
  });
});
