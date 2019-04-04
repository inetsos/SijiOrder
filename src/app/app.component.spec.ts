import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

<<<<<<< HEAD
  it(`should have as title 'SijiOrder-order'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('SijiOrder-order');
=======
  it(`should have as title 'SijiOrder-shop'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('SijiOrder-shop');
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
<<<<<<< HEAD
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to SijiOrder-order!');
=======
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to SijiOrder-shop!');
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
  });
});
