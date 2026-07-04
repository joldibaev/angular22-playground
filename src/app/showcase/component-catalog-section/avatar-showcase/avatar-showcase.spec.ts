import { TestBed } from '@angular/core/testing';
import { AvatarShowcase } from './avatar-showcase';

describe('AvatarShowcase', () => {
  it('documents images, sizes, fallbacks, and anonymous placeholders', async () => {
    const fixture = TestBed.createComponent(AvatarShowcase);
    await fixture.whenStable();
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Sizes');
    expect(text).toContain('Initials and image fallback');
    expect(text).toContain('Named and anonymous');
    expect(fixture.nativeElement.querySelectorAll('ui-card')).toHaveLength(4);
  });
});
