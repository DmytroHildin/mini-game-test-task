import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameScore } from './game-score';

describe('GameScore', () => {
  let component: GameScore;
  let fixture: ComponentFixture<GameScore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameScore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameScore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
