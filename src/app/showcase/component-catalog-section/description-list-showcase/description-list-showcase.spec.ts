import { TestBed } from '@angular/core/testing';
import { DescriptionListShowcase } from './description-list-showcase';

describe('DescriptionListShowcase', () => {
  it('documents icon and narrow-container examples', async () => {
    const fixture = TestBed.createComponent(DescriptionListShowcase);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('app-showcase-example')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('ui-description-list')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('div[uiDescription]')).toHaveLength(4);
  });
});
