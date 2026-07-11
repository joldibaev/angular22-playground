import { createToastState } from './ui-sonner.state';

describe('createToastState', () => {
  let state: ReturnType<typeof createToastState>;

  beforeEach(() => {
    state = createToastState();
  });

  it('updates an existing toast and resets a settled loading duration', () => {
    state.loading('Saving', { id: 'request' });
    state.success('Saved', { id: 'request' });

    expect(state.toasts()).toHaveLength(1);
    expect(state.toasts()[0]).toEqual(
      expect.objectContaining({
        id: 'request',
        title: 'Saved',
        type: 'success',
        duration: undefined,
        updated: true,
      }),
    );
  });

  it('keeps height order aligned with the toast stack and cleans it on removal', () => {
    state.message('First', { id: 'first' });
    state.message('Second', { id: 'second' });
    state.addHeight({ toastId: 'first', height: 40 });
    state.addHeight({ toastId: 'second', height: 60 });

    expect(state.heights().map((item) => item.toastId)).toEqual(['second', 'first']);

    state.remove('second');

    expect(state.toasts().map((toast) => toast.id)).toEqual(['first']);
    expect(state.heights()).toEqual([{ toastId: 'first', height: 40 }]);
  });

  it('marks one or all toasts for animated dismissal', () => {
    state.message('First', { id: 'first' });
    state.message('Second', { id: 'second' });

    expect(state.dismiss('first')).toBe('first');
    expect(state.toasts().find((toast) => toast.id === 'first')).toEqual(
      expect.objectContaining({ delete: true, dismissing: true }),
    );

    expect(state.dismiss()).toBeUndefined();
    expect(state.toasts().every((toast) => toast.delete && toast.dismissing)).toBe(true);
  });

  it('settles promise toasts and calls the finalizer', async () => {
    let resolveFinalized!: () => void;
    const finalized = new Promise<void>((resolve) => {
      resolveFinalized = resolve;
    });
    const finalizer = vi.fn(resolveFinalized);
    const id = state.promise(Promise.resolve({ name: 'Report' }), {
      id: 'upload',
      loading: 'Uploading',
      success: (value) => `${value.name} uploaded`,
      finally: finalizer,
    });

    expect(id).toBe('upload');
    expect(state.toasts()[0].type).toBe('loading');

    await finalized;

    expect(state.toasts()[0]).toEqual(
      expect.objectContaining({ id: 'upload', title: 'Report uploaded', type: 'success' }),
    );
    expect(finalizer).toHaveBeenCalledOnce();
  });

  it('isolates notifications and generated ids between application stores', () => {
    const firstRequest = createToastState();
    const secondRequest = createToastState();

    expect(firstRequest.message('First request')).toBe(0);
    expect(secondRequest.message('Second request')).toBe(0);
    expect(firstRequest.toasts().map((toast) => toast.title)).toEqual(['First request']);
    expect(secondRequest.toasts().map((toast) => toast.title)).toEqual(['Second request']);
  });
});
