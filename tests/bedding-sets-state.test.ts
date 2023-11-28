import { describe, expect, test } from '@jest/globals';

import BeddingSets from '../src/domain/bedding-sets-state';
import { BeddingSetsState, BeddingSetsStateOnDate } from '../src/interfaces/bedding-sets-states-report';

describe('BeddingSets', () => {

    test('beddingSets at creation', () => {
        const beddingSets = new BeddingSets();
        expect(beddingSets.cleaned).toBe(0);
        expect(beddingSets.in_use).toBe(0);
        expect(beddingSets.dirty).toBe(0);
        expect(beddingSets.in_laundery).toBe(0);
    });

    test('onCheckIn remove sets from cleaning and add to use', () => {
        const beddingSets = new BeddingSets();
        beddingSets.onCheckIn(1);
        expect(beddingSets.cleaned).toBe(-1);
        expect(beddingSets.in_use).toBe(1);
        expect(beddingSets.dirty).toBe(0);
        expect(beddingSets.in_laundery).toBe(0);
    })

    test('onCheckOut remove sets from use and add to dirty', () => {
        const beddingSets = new BeddingSets();
        beddingSets.onCheckOut(1);
        expect(beddingSets.cleaned).toBe(0);
        expect(beddingSets.in_use).toBe(-1);
        expect(beddingSets.dirty).toBe(1);
        expect(beddingSets.in_laundery).toBe(0);
    })

    test('addBeddingSets add sets to cleaning', () => {
        const beddingSets = new BeddingSets();
        beddingSets.addBeddingSets(1);
        expect(beddingSets.cleaned).toBe(1);
        expect(beddingSets.in_use).toBe(0);
        expect(beddingSets.dirty).toBe(0);
        expect(beddingSets.in_laundery).toBe(0);
    })

    test('OnBrougthForCleaning remove sets from dirty and add to claaning', () => {
        const beddingSets = new BeddingSets();
        beddingSets.OnBrougthForCleaning(1);
        expect(beddingSets.cleaned).toBe(0);
        expect(beddingSets.in_use).toBe(0);
        expect(beddingSets.dirty).toBe(-1);
        expect(beddingSets.cleaning).toBe(1);
        expect(beddingSets.in_laundery).toBe(0);
    })

    test('onFinishCleaning remove sets from cleaning and add to in laundry', () => {
        const beddingSets = new BeddingSets();
        beddingSets.onFinishCleaning(1);
        expect(beddingSets.cleaned).toBe(0);
        expect(beddingSets.in_use).toBe(0);
        expect(beddingSets.dirty).toBe(0);
        expect(beddingSets.cleaning).toBe(-1);
        expect(beddingSets.in_laundery).toBe(1);
    })


    test('onPickupLaundry remove sets from laundery and add to clean', () => {
        const beddingSets = new BeddingSets();
        beddingSets.onPickupLaundry(1);
        expect(beddingSets.cleaned).toBe(1);
        expect(beddingSets.in_use).toBe(0);
        expect(beddingSets.dirty).toBe(0);
        expect(beddingSets.cleaning).toBe(0);
        expect(beddingSets.in_laundery).toBe(-1);
    })

    test('setup bedding sets states', () => {
        const beddingSets = new BeddingSets();
        const dataSetup: BeddingSetsState= {
            cleaned: 1,
            in_use: 2,
            dirty: 3,
            cleaning: 4,
            in_laundery: 5
        }
        beddingSets.setup(dataSetup);        
        expect(beddingSets.cleaned).toBe(1);
        expect(beddingSets.in_use).toBe(2);
        expect(beddingSets.dirty).toBe(3);
        expect(beddingSets.cleaning).toBe(4);
        expect(beddingSets.in_laundery).toBe(5);
    })
})