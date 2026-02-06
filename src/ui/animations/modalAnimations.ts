import { trigger, state, transition, style, animate } from "@angular/animations";

export const fadeOverlay = trigger('fadeOverlay', [
    state('open', style({opacity: 1})),
    state('close', style({opacity: 0})),
    transition('* => open', [animate('300ms ease-in')]),
    transition('open => close', [animate('200ms ease-out')])
]);

export const fadeInOut = trigger('fadeInOut', [
    state('open', style({opacity: 1, transform: 'translateY(10%)'})),
    state('close', style({opacity: 0, transform: 'translateY(-25%) '})),
    transition('* => open', [animate('340ms ease-out')]),
    transition('* => close', [animate('340ms ease-out')])
])