import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ClosingSource } from '../interfaces';

@Injectable()
export class ModalRef {
    private closedSubject$ = new Subject<ClosingSource>();
    private closeRequestSubject$ = new Subject<ClosingSource>();

    requestClose(source: ClosingSource) {
        this.closeRequestSubject$.next(source);
    }

    onCloseRequested() {
        return this.closeRequestSubject$.asObservable();
    }

    notifyClosed(source: ClosingSource) {
        this.closedSubject$.next(source);
        this.closedSubject$.complete();
    }

    onClose() {
        return this.closedSubject$.asObservable();
    }
}