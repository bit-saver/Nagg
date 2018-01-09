import { NaggPage } from './app.po';

describe('nagg App', () => {
  let page: NaggPage;

  beforeEach(() => {
    page = new NaggPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
