/**
 * Componente de seleção responsiva.
 *
 * Desktop: usa o Select (Radix) tradicional com portal e trigger.
 * Mobile (largura < breakpoint): substitui por Drawer full-width + RadioGroup com alvos de toque maiores.
 *
 * Benefícios:
 * - Experiência otimizada para polegar em telas pequenas.
 * - Mantém acessibilidade (aria-label, aria-expanded, aria-haspopup).
 * - Bloqueia scroll de fundo quando aberto em mobile para evitar deslocamento acidental.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

/** Opção simples para seleção */
type Option = { value: string; label: string };

export type ResponsiveSelectProps = {
    value: string | undefined;
    onChange: (v: string) => void;
    options: Option[];
    placeholder?: string;
    label?: string;
    className?: string;
    triggerClassName?: string;
    title?: string;
    ariaLabel?: string;
};

export function ResponsiveSelect({
    value,
    onChange,
    options,
    placeholder,
    label,
    className,
    triggerClassName,
    title,
    ariaLabel,
}: ResponsiveSelectProps) {
    const isMobile = useIsMobile();
    const [open, setOpen] = React.useState(false);

    // Evita scroll do background quando o Drawer mobile está aberto
    React.useEffect(() => {
        if (!isMobile) return;
        const prev = document.body.style.overflow;
        if (open) document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open, isMobile]);

    if (!isMobile) {
        return (
            <div className={className} aria-label={ariaLabel}>
                {label ? <div className="sr-only">{label}</div> : null}
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className={cn("w-full", triggerClassName)}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    }

    // Mobile: drawer inferior com opções via RadioGroup (grandes para toque)
    const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder ?? label ?? "Selecionar";

    return (
        <div className={className} aria-label={ariaLabel}>
            <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
                <Button
                    type="button"
                    variant="outline"
                    className={cn("w-full justify-between", triggerClassName)}
                    onClick={() => setOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    aria-label={ariaLabel ?? label ?? placeholder}
                >
                    <span className="truncate">{selectedLabel}</span>
                    <span className="sr-only">Abrir seleção</span>
                </Button>
                <DrawerContent className="max-h-[85vh]">
                    <DrawerHeader>
                        <DrawerTitle>{title ?? label ?? placeholder ?? "Selecionar"}</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pt-0">
                        <RadioGroup
                            value={value}
                            onValueChange={(v) => {
                                onChange(v);
                                setOpen(false);
                            }}
                            className="space-y-2 max-h-[60vh] overflow-y-auto pr-1"
                            aria-label={ariaLabel ?? label ?? placeholder}
                        >
                            {options.map((opt) => (
                                <label
                                    key={opt.value}
                                    className="flex items-center gap-3 rounded-md border p-3 text-base leading-6"
                                >
                                    <RadioGroupItem value={opt.value} />
                                    <span className="flex-1">{opt.label}</span>
                                </label>
                            ))}
                        </RadioGroup>
                        <div className="mt-4">
                            <DrawerClose asChild>
                                <Button className="w-full" variant="secondary">Fechar</Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default ResponsiveSelect;
