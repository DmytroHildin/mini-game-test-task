import { ApplicationRef, ViewContainerRef, ComponentRef, Injectable, Injector, TemplateRef, Type, EnvironmentInjector, createComponent } from '@angular/core';
//import { ModalInstance, ModalOptions } from '../interfaces/ui.model';
import { takeUntil } from 'rxjs';
import { ModalWrapperComponent } from '../components/modal-wrapper/modal-wrapper';
import { ModalRef } from '../injectors/modal-ref';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

    constructor(
        private appRef: ApplicationRef,
        private envInjector: EnvironmentInjector,
        private injector: Injector
    ) { }

    open<T>(content: Type<T>): ModalRef {
        const modalRef = new ModalRef();

        const modalWrapperInstance = createComponent(ModalWrapperComponent, {
            environmentInjector: this.envInjector,
            elementInjector: Injector.create({
                providers: [{ provide: ModalRef, useValue: modalRef }],
                parent: this.injector
            })
        });
        console.log(modalWrapperInstance);

        this.appRef.attachView(modalWrapperInstance.hostView);
        document.body.appendChild(modalWrapperInstance.location.nativeElement);

        modalWrapperInstance.instance.containerReady.subscribe(container => {
            const contentRef = modalWrapperInstance.instance.container.createComponent(content);
        });

        // set to microtask 
        Promise.resolve().then(() => {
            modalWrapperInstance.instance.isOpen = true
        })     
        
        modalRef.onCloseRequested().pipe(
            takeUntil(modalWrapperInstance.instance.destroySubject$)
        )
        .subscribe(source => modalWrapperInstance.instance.close(source));

        modalWrapperInstance.instance.afterModalClose.pipe(
            takeUntil(modalWrapperInstance.instance.destroySubject$)
        )
        .subscribe(() => {
            console.log('CLOSE POPUP');
            this.destroyInstance(modalWrapperInstance)
        });

        return modalRef;
    }

    destroyInstance(modalInstance: ComponentRef<ModalWrapperComponent>): void {
        this.appRef.detachView(modalInstance.hostView);
        modalInstance.destroy();
    }
}