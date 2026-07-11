import { afterElementAnimations } from './after-element-animations';

describe('afterElementAnimations', () => {
  it('completes when zero-duration or overridden CSS creates no animations', async () => {
    const element = document.createElement('div');
    element.getAnimations = () => [];
    const complete = vi.fn();

    afterElementAnimations(element, complete);
    await Promise.resolve();

    expect(complete).toHaveBeenCalledOnce();
  });

  it('waits for running animations to settle', async () => {
    const element = document.createElement('div');
    const finished = Promise.resolve({} as Animation);
    element.getAnimations = () => [{ finished }] as unknown as Animation[];
    const complete = vi.fn();

    afterElementAnimations(element, complete);
    await Promise.resolve();
    expect(complete).not.toHaveBeenCalled();

    await finished;
    await Promise.resolve();
    expect(complete).toHaveBeenCalledOnce();
  });
});
