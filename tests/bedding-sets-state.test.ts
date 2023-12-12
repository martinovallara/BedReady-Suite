import { describe, expect, test } from '@jest/globals';

import BeddingSets from '../src/domain/bedding-sets-state-read-model.js';
import { BeddingSetsState } from '../src/interfaces/bedding-sets-states-report';

describe('BeddingSets', () => {
    let beddingSets: BeddingSets
    const beddingSetsState = () => beddingSets.state
    beforeEach(() => {
        beddingSets = new BeddingSets();
    })

    test('beddingSets at creation', () => {
        const state = beddingSetsState();
        expect(state.cleaned).toBe(0);
        expect(state.inUse).toBe(0);
        expect(state.dirty).toBe(0);
        expect(state.inLaundery).toBe(0);
    });

    test('onCheckIn remove sets from cleaning and add to use', () => {
        beddingSets.onCheckIn(1);
        const state = beddingSetsState();
        expect(state.cleaned).toBe(-1);
        expect(state.inUse).toBe(1);
        expect(state.dirty).toBe(0);
        expect(state.inLaundery).toBe(0);
    })

    test('onCheckOut remove sets from use and add to dirty', () => {

        beddingSets.onCheckOut(1);
        const state = beddingSetsState();
        expect(state.cleaned).toBe(0);
        expect(state.inUse).toBe(-1);
        expect(state.dirty).toBe(1);
        expect(state.inLaundery).toBe(0);
    })

    test('addBeddingSets add sets to cleaning', () => {

        beddingSets.addBeddingSets(1);
        const state = beddingSetsState();
        expect(state.cleaned).toBe(1);
        expect(state.inUse).toBe(0);
        expect(state.dirty).toBe(0);
        expect(state.inLaundery).toBe(0);
    })

    test('OnBrougthForCleaning remove sets from dirty and add to cleaning', () => {
        beddingSets.setup({ cleaned: 0, inUse: 0, dirty: 1, cleaning: 0, inLaundery: 0 });
        beddingSets.OnBrougthForCleaning(1);

        const state = beddingSetsState();
        expect(state.cleaned).toBe(0);
        expect(state.inUse).toBe(0);
        expect(state.dirty).toBe(0);
        expect(state.cleaning).toBe(1);
        expect(state.inLaundery).toBe(0);
    })

    test('OnBrougthForCleaning moves first from dirty and if not enough from inUse and clean to cleaning', () => {
        beddingSets.setup({ cleaned: 1, inUse: 1, dirty: 1, cleaning: 0, inLaundery: 0 });
        beddingSets.OnBrougthForCleaning(3);

        const state = beddingSetsState();
        expect(state.cleaned).toBe(0);
        expect(state.inUse).toBe(0);
        expect(state.dirty).toBe(0);
        expect(state.cleaning).toBe(3);
        expect(state.inLaundery).toBe(0);
    })

    test('onFinishCleaning remove sets from cleaning and add to in laundry', () => {
        beddingSets.setup({ cleaned: 0, inUse: 0, dirty: 0, cleaning: 2, inLaundery: 0 });
        beddingSets.onFinishCleaning(1);
        const state = beddingSetsState();
        expect(state.cleaned).toBe(0);
        expect(state.inUse).toBe(0);
        expect(state.dirty).toBe(0);
        expect(state.cleaning).toBe(1);
        expect(state.inLaundery).toBe(1);
    })


    test('onFinishCleaning not remove sets from cleaning when not enought sets are in cleaning', () => {
        beddingSets.setup({ cleaned: 0, inUse: 0, dirty: 0, cleaning: 2, inLaundery: 0 });
        beddingSets.onFinishCleaning(4);
        const state = beddingSetsState();
        expect(state.cleaned).toBe(0);
        expect(state.inUse).toBe(0);
        expect(state.dirty).toBe(0);
        expect(state.cleaning).toBe(0);
        expect(state.inLaundery).toBe(2);
    })


    test('onPickupLaundry remove sets from laundery and add to clean when inLaundery is positive', () => {

        beddingSets.setup({ cleaned: 0, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 1});

        beddingSets.onPickupLaundry(1);
        const state = beddingSetsState();
        expect(state.cleaned).toBe(1);
        expect(state.inUse).toBe(0);
        expect(state.dirty).toBe(0);
        expect(state.cleaning).toBe(0);
        expect(state.inLaundery).toBe(0);
    })

    test('onPickupLaundry remove sets from laundery and from cleaning when inLaundery is less sets pickuped', () => {

        beddingSets.onPickupLaundry(1);
        const state = beddingSetsState();
        expect(state.cleaned).toBe(1);
        expect(state.inUse).toBe(0);
        expect(state.dirty).toBe(0);
        expect(state.cleaning).toBe(-1);
        expect(state.inLaundery).toBe(0);
    })


    test('setup bedding sets states', () => {

        const dataSetup: BeddingSetsState = {
            cleaned: 1,
            inUse: 2,
            dirty: 3,
            cleaning: 4,
            inLaundery: 5
        }
        beddingSets.setup(dataSetup);
        const state = beddingSetsState();
        expect(state.cleaned).toBe(1);
        expect(state.inUse).toBe(2);
        expect(state.dirty).toBe(3);
        expect(state.cleaning).toBe(4);
        expect(state.inLaundery).toBe(5);
    })


})