/// <reference types="cypress" />
import { TIngredient } from '../../src/utils/types';

describe('тесты страницы constructor-page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.setCookie('accessToken', '123');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
 
  });
  function addBunAndSauce(bun, sauce) {
    cy.get(`[data-cy="Ингредиент в списке ингредиентов: ${sauce}"]`)
    .contains('button', 'Добавить')
    .click();
    cy.get(`[data-cy="Ингредиент в списке ингредиентов: ${bun}"]`)
    .contains('button', 'Добавить')
    .click();
  }
  it('проверяем добавление ингредиента и булки в конструктор', () => {
    cy.fixture('ingredients.json').then((ingredients) => {
      const sauce = ingredients.data[2].name;
      const bun = ingredients.data[0].name;
      addBunAndSauce(bun, sauce)
      cy.get('[data-cy="Булка в конструкторе"]');
      cy.get('[data-cy="Ингредиенты в конструкторе"]').should(
        'contain',
        `${sauce}`
      );
      cy.get('[data-cy="Булка в конструкторе"]').should('contain', `${bun}`);
    });
  });
  describe('проверяем открытие и закрытие модальных окон', () => {
    beforeEach(() => {
      cy.fixture('ingredients.json').then((ingredients) => {
        cy.get(
          `[data-cy="Ингредиент в списке ингредиентов: ${ingredients.data[0].name}"]`
        ).click();
      })
     
      cy.get('[data-cy="Модалка"]').should('exist');
      cy.url().should('include', 'ingredients');
    });
    afterEach(() => {
      cy.get('[data-cy="Модалка"]').should('not.exist');
      cy.url().should('not.include', 'ingredients');
    });
    it('закрытие через кнопку', () => {
      cy.get('[data-cy="Модалка"]').find('button').click();
    });
    it('закрытие через клик на оверлей', () => {
      cy.get('[data-cy="Оверлей модалки"]').click({ force: true }); // нужно форсить клик либо немного сдвигать координаты
      // иначе cypress жалуется, что оверлей перекрыт картинкой и не кликает
    });
  });
  it('проверяем создание заказа', () => {
    cy.fixture('ingredients.json').then((ingredients) => {
      const sauce = ingredients.data[2].name;
      const bun = ingredients.data[0].name;
      addBunAndSauce(bun, sauce)
    })
    cy.intercept('GET', '**/api/orders/**', { fixture: 'orderDone.json' }).as(
      'getOrder'
    );
    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@getOrder').then((interception) => {
      const orderNumber = interception.response!.body.orders[0].number;
      cy.get('[data-cy="Модалка"]').should('exist').and('contain', orderNumber);
    });
    cy.get('[data-cy="Модалка"]').find('button').eq(1).click(); // у модалки почему-то две кнопки
    cy.get('[data-cy="Модалка"]').should('not.exist');
    cy.contains('Выберите булки');
    cy.contains('Выберите начинку');
  });
});
