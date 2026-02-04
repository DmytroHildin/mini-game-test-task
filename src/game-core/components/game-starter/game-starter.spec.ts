import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStarter } from './game-starter';

describe('GameStarter', () => {
  let component: GameStarter;
  let fixture: ComponentFixture<GameStarter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameStarter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameStarter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
