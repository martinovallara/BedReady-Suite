import googleDriveApis from "../src/libs/google-drive-apis";
import * as googleDriveStorage from "../src/infrastructure/services/google-drive-storage";
import { clearJsonResponseCache, getJsonResponseCache } from "../src/utils/string-cache.js";

describe('readStorageFromDrive and persistToDrive', () => {
    it('should persist and read the same JSON string', async () => {

        const jsonString = JSON.stringify({
            key: "value",
            key2: Date.now().toLocaleString()
        });

        await googleDriveStorage.persistToDrive(jsonString);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const persistedJsonString = await googleDriveStorage.readStorageFromDrive();

        expect(persistedJsonString).toEqual(jsonString);

    });
});

describe('readStorageFromDrive with caching', () => {
    it('should use cache on second read', async () => {
        // reset cache before test
        clearJsonResponseCache();
        expect(getJsonResponseCache()).toBeUndefined();

        // Mock the function readJsonContentFromDrive
        const readJsonContentFromDrive = jest
            .spyOn(googleDriveApis, 'readJsonContentFromDrive')


        // Call readToDrive twice
        await googleDriveStorage.readStorageFromDrive();
        expect(getJsonResponseCache()).toBeDefined();
        await googleDriveStorage.readStorageFromDrive();

        // Expect readToDrive to be called only once
        expect(readJsonContentFromDrive).toHaveBeenCalledTimes(1);

        // Clean up the mock
        readJsonContentFromDrive.mockRestore();
    });

    it('should set cache on persistToDrive and readStorageFromDrive use cache', async () => {
        // reset cache before test
        clearJsonResponseCache();
        expect(getJsonResponseCache()).toBeUndefined();

        // Mock the function readJsonContentFromDrive
        const readJsonContentFromDrive = jest
            .spyOn(googleDriveApis, 'readJsonContentFromDrive')


        await googleDriveStorage.persistToDrive("test");
        expect(getJsonResponseCache()).toBeDefined();

        await googleDriveStorage.readStorageFromDrive();
        expect(readJsonContentFromDrive).toHaveBeenCalledTimes(0);
        // Clean up the mock
        readJsonContentFromDrive.mockRestore();
    });
});
