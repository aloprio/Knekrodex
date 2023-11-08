import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiedepaginaComponent } from './piedepagina.component';

describe('PiedepaginaComponent', () => {
  let component: PiedepaginaComponent;
  let fixture: ComponentFixture<PiedepaginaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PiedepaginaComponent]
    });
    fixture = TestBed.createComponent(PiedepaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
