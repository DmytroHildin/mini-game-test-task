import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ModalRef {
    private closeSubject$ = new Subject<void>();
    onClose = this.closeSubject$.asObservable();

    close() {
        this.closeSubject$.next();
    }
}