import { describe, expect, test } from '@jest/globals';

import BeddingSets from '../src/domain/bedding-sets-state-read-model.js';
import { BeddingSetsState } from '../src/interfaces/bedding-sets-states-report';

describe('BeddingSets', () => {
    let beddingSets: BeddingSets
    const beddingSetsState = () => beddingSets.state
    //todo: improve test efficenty
    beforeEach(() => {
        beddingSets = new BeddingSets();
    })

    test('beddingSets at creation', () => {

        expect(beddingSetsState().cleaned).toBe(0);
        expect(beddingSetsState().inUse).toBe(0);
        expect(beddingSetsState().dirty).toBe(0);
        expect(beddingSetsState().inLaundery).toBe(0);
    });

    test('onCheckIn remove sets from cleaning and add to use', () => {
        beddingSets.onCheckIn(1);
        expect(beddingSetsState().cleaned).toBe(-1);
        expect(beddingSetsState().inUse).toBe(1);
        expect(beddingSetsState().dirty).toBe(0);
        expect(beddingSetsState().inLaundery).toBe(0);
    })

    test('onCheckOut remove sets from use and add to dirty', () => {

        beddingSets.onCheckOut(1);
        expect(beddingSetsState().cleaned).toBe(0);
        expect(beddingSetsState().inUse).toBe(-1);
        expect(beddingSetsState().dirty).toBe(1);
        expect(beddingSetsState().inLaundery).toBe(0);
    })

    test('addBeddingSets add sets to cleaning', () => {

        beddingSets.addBeddingSets(1);
        expect(beddingSetsState().cleaned).toBe(1);
        expect(beddingSetsState().inUse).toBe(0);
        expect(beddingSetsState().dirty).toBe(0);
        expect(beddingSetsState().inLaundery).toBe(0);
    })

    test('OnBrougthForCleaning remove sets from dirty and add to claaning', () => {

        beddingSets.OnBrougthForCleaning(1);
        expect(beddingSetsState().cleaned).toBe(0);
        expect(beddingSetsState().inUse).toBe(0);
        expect(beddingSetsState().dirty).toBe(-1);
        expect(beddingSetsState().cleaning).toBe(1);
        expect(beddingSetsState().inLaundery).toBe(0);
    })

    test('onFinishCleaning remove sets from cleaning and add to in laundry', () => {

        beddingSets.onFinishCleaning(1);
        expect(beddingSetsState().cleaned).toBe(0);
        expect(beddingSetsState().inUse).toBe(0);
        expect(beddingSetsState().dirty).toBe(0);
        expect(beddingSetsState().cleaning).toBe(-1);
        expect(beddingSetsState().inLaundery).toBe(1);
    })


    test('onPickupLaundry remove sets from laundery and add to clean when inLaundery is positive', () => {

        beddingSets.setup({ cleaned: 0, inUse: 0, dirty: 0, cleaning: 0, inLaundery: 1});

        beddingSets.onPickupLaundry(1);
        expect(beddingSetsState().cleaned).toBe(1);
        expect(beddingSetsState().inUse).toBe(0);
        expect(beddingSetsState().dirty).toBe(0);
        expect(beddingSetsState().cleaning).toBe(0);
        expect(beddingSetsState().inLaundery).toBe(0);
    })

    test('onPickupLaundry remove sets from laundery and from cleaning when inLaundery is less sets pickuped', () => {

        beddingSets.onPickupLaundry(1);
        expect(beddingSetsState().cleaned).toBe(1);
        expect(beddingSetsState().inUse).toBe(0);
        expect(beddingSetsState().dirty).toBe(0);
        expect(beddingSetsState().cleaning).toBe(-1);
        expect(beddingSetsState().inLaundery).toBe(0);
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
        expect(beddingSetsState().cleaned).toBe(1);
        expect(beddingSetsState().inUse).toBe(2);
        expect(beddingSetsState().dirty).toBe(3);
        expect(beddingSetsState().cleaning).toBe(4);
        expect(beddingSetsState().inLaundery).toBe(5);
    })


})