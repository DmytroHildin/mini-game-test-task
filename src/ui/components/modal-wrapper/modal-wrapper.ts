import { Component, ElementRef, EventEmitter, Output, ViewChild, TemplateRef, ViewContainerRef, OnDestroy, Input, AfterViewInit, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { Subject } from 'rxjs';
import { fadeInOut, fadeOverlay } from '../../animations/modalAnimations';
import { ModalRef } from '../../injectors/modal-ref';
import { ClosingSource } from '../../interfaces';

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.html',
  styleUrl: './modal-wrapper.scss',
  animations: [fadeInOut, fadeOverlay]
})
export class ModalWrapperComponent implements AfterViewInit, OnDestroy {
    @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;

    containerReady = new Subject<ViewContainerRef>();

    @Output() beforeModalClose = new EventEmitter<void>();
    @Output() afterModalClose = new EventEmitter<void>();
 
    isOpen: boolean = false;
    private destroy$ = new Subject<void>();
  
    constructor(private modalRef: ModalRef) {}

    ngAfterViewInit(): void {
        this.containerReady.next(this.container);
        this.containerReady.complete();
    }

    close(source: ClosingSource) {
        this.isOpen = false;
        this.modalRef.notifyClosed(source);
    }

    onAnimationDone(event: AnimationEvent) {
        console.log(event)
        if (event.fromState === 'open' && event.toState === 'close' && event.phaseName === 'done') {
            this.afterModalClose.emit();
        }        
    }

    get destroySubject$() {
        return this.destroy$.asObservable();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}