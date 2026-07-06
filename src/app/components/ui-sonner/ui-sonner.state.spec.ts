import { uiSonnerState } from './ui-sonner.state';

describe('uiSonnerState', () => {
  beforeEach(() => uiSonnerState.reset());

  it('updates an existing toast and resets a settled loading duration', () => {
    uiSonnerState.loading('Saving', { id: 'request' });
    uiSonnerState.success('Saved', { id: 'request' });

    expect(uiSonnerState.toasts()).toHaveLength(1);
    expect(uiSonnerState.toasts()[0]).toEqual(
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
    uiSonnerState.message('First', { id: 'first' });
    uiSonnerState.message('Second', { id: 'second' });
    uiSonnerState.addHeight({ toastId: 'first', height: 40 });
    uiSonnerState.addHeight({ toastId: 'second', height: 60 });

    expect(uiSonnerState.heights().map((item) => item.toastId)).toEqual(['second', 'first']);

    uiSonnerState.remove('second');

    expect(uiSonnerState.toasts().map((toast) => toast.id)).toEqual(['first']);
    expect(uiSonnerState.heights()).toEqual([{ toastId: 'first', height: 40 }]);
  });

  it('marks one or all toasts for animated dismissal', () => {
    uiSonnerState.message('First', { id: 'first' });
    uiSonnerState.message('Second', { id: 'second' });

    expect(uiSonnerState.dismiss('first')).toBe('first');
    expect(uiSonnerState.toasts().find((toast) => toast.id === 'first')).toEqual(
      expect.objectContaining({ delete: true, dismissing: true }),
    );

    expect(uiSonnerState.dismiss()).toBeUndefined();
    expect(uiSonnerState.toasts().every((toast) => toast.delete && toast.dismissing)).toBe(true);
  });

  it('settles promise toasts and calls the finalizer', async () => {
    let resolveFinalized!: () => void;
    const finalized = new Promise<void>((resolve) => {
      resolveFinalized = resolve;
    });
    const finalizer = vi.fn(resolveFinalized);
    const id = uiSonnerState.promise(Promise.resolve({ name: 'Report' }), {
      id: 'upload',
      loading: 'Uploading',
      success: (value) => `${value.name} uploaded`,
      finally: finalizer,
    });

    expect(id).toBe('upload');
    expect(uiSonnerState.toasts()[0].type).toBe('loading');

    await finalized;

    expect(uiSonnerState.toasts()[0]).toEqual(
      expect.objectContaining({ id: 'upload', title: 'Report uploaded', type: 'success' }),
    );
    expect(finalizer).toHaveBeenCalledOnce();
  });
});
