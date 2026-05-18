import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexStatusComponent } from './index-status.component';

describe('IndexStatusComponent', () => {
  let component: IndexStatusComponent;
  let fixture: ComponentFixture<IndexStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexStatusComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
