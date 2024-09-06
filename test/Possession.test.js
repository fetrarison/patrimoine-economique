import { expect } from 'chai';
import { describe, it } from 'mocha';
import Possession from '../models/possessions/Possession.js';

describe('getValeurApresAmortissement', () => {
    it('devrait retourner 0 lorsque la dateActuelle est après la dateFin', () => {
        const poss = new Possession('test', 'test', 100, new Date('2022-01-01'), new Date('2022-12-31'), 10);
        const result = poss.getValeurApresAmortissement(new Date('2023-01-01'));
        expect(result).to.be.equal(0);
    });

    it('devrait renvoyer la valeur correcte lorsque la différence en années est de 1', () => {
        const poss = new Possession('test', 'test', 100, new Date('2022-01-01'), new Date('2023-01-01'), 10);
        const result = poss.getValeurApresAmortissement(new Date('2023-01-01'));
        const expectedValue = 90; //60
        expect(result).to.be.equal(expectedValue);
    });

    it('devrait renvoyer la valeur initiale lorsque tauxAmortissement est 0', () => {
        const poss = new Possession('test', 'test', 100, new Date('2022-01-01'), new Date('2023-01-01'), 0);
        const result = poss.getValeurApresAmortissement(new Date('2023-01-01'));
        expect(result).to.be.equal(100);
    });

    it('should return the correct value when the dateActuelle is in the middle of the dateDebut and dateFin', () => {
        const poss = new Possession('test', 'test', 100, new Date('2022-01-01'), new Date('2023-01-01'), 10);
        const dateMid = new Date('2022-07-01');
        const result = poss.getValeurApresAmortissement(dateMid);
        const expectedValue = 95;
        expect(result).to.be.equal(expectedValue);
    });
});