import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesPokemonComponent } from './detalles-pokemon.component';

describe('DetallesPokemonComponent', () => {
  let component: DetallesPokemonComponent;
  let fixture: ComponentFixture<DetallesPokemonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesPokemonComponent]
    });
    fixture = TestBed.createComponent(DetallesPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
