import { expect } from 'chai';
import { describe, it } from 'mocha';
import Patrimoine from '../models/Patrimoine.js';

describe('getValeur', () => {
    it("devrait retourner 0 lorsqu'il n'y a aucune possession", () => {
        const patrimoine = new Patrimoine('John Doe', []);
        expect(patrimoine.getValeur(new Date())).to.be.equal(0);
    });

    it("devrait retourner la somme correcte des valeurs de possession pour une entrée valide", () => {
        const possessions = [
            { getValeur: () => 100 },
            { getValeur: () => 200 },
        ];
        const patrimoine = new Patrimoine('John Doe', possessions);
        expect(patrimoine.getValeur(new Date())).to.be.equal(300);
    });

    it("doit retourner la somme correcte des valeurs de possession pour les possessions avec différentes fonctions getValeur", () => {
        const possessions = [
            { getValeur: () => 500 },
            { getValeur: () => 200 },
        ];
        const patrimoine = new Patrimoine('John Doe', possessions);
        expect(patrimoine.getValeur(new Date())).to.be.equal(700);
    });
});
