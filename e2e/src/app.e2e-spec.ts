import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
<<<<<<< HEAD
    expect(page.getParagraphText()).toEqual('Welcome to SijiOrder-order!');
=======
    expect(page.getParagraphText()).toEqual('Welcome to SijiOrder-shop!');
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
  });
});
