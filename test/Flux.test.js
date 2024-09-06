import { expect } from 'chai';
import { describe, it } from 'mocha';
import Flux from "../models/possessions/Flux.js";

describe("getValeur", () => {
  let instance;

  beforeEach(() => {
    instance = new Flux("possesseur", "libelle", 400000, new Date(2024, 0, 1), new Date(2024, 0, 1), 0, 1);
  });

  it("devrait retourner 0 lorsque la date est la même que la date début", () => {
    const date = new Date(2024, 0, 1);
    expect(instance.getValeur(date)).to.equal(0);
  });
});
