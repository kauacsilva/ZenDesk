import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useToast", () => {
    beforeEach(() => {
        vi.resetModules();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("adds and dismisses toasts via the public API", async () => {
        const mod = await import("./use-toast");
        const { useToast, toast } = mod;

        const { result } = renderHook(() => useToast());

        act(() => {
            toast({ title: "Olá" });
        });

        expect(result.current.toasts).toHaveLength(1);
        const toastId = result.current.toasts[0].id;
        expect(result.current.toasts[0].title).toBe("Olá");

        act(() => {
            result.current.dismiss(toastId);
        });

        expect(result.current.toasts[0]?.open).toBe(false);

        await act(async () => {
            vi.runAllTimers();
        });

        expect(result.current.toasts).toHaveLength(0);
    });

    it("reducer updates and removes toasts", async () => {
        const mod = await import("./use-toast");
        const { reducer } = mod;

        const addAction: Parameters<typeof reducer>[1] = {
            type: "ADD_TOAST",
            toast: { id: "1", title: "Primeiro", open: true },
        };
        const updateAction: Parameters<typeof reducer>[1] = {
            type: "UPDATE_TOAST",
            toast: { id: "1", description: "Atualizado" },
        };

        const added = reducer({ toasts: [] }, addAction);
        const updated = reducer(added, updateAction);
        expect(updated.toasts[0].description).toBe("Atualizado");

        const removeAction: Parameters<typeof reducer>[1] = {
            type: "REMOVE_TOAST",
            toastId: "1",
        };
        const removed = reducer(updated, removeAction);
        expect(removed.toasts).toHaveLength(0);
    });
});
