import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Container({ children, className, clean = false }) {
    return (
        <div className={cn(
            "max-w-7xl mx-auto px-6 md:px-12",
            !clean && "w-full",
            className
        )}>
            {children}
        </div>
    );
}
